# Redirección HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name app.rranzag.com;

    # Add rate limiting on HTTP as well
##    limit_req_zone $binary_remote_addr zone=http_burst:10m rate=10r/m;
    limit_req zone=http_burst burst=20 nodelay;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.rranzag.com;

    # SSL config...
    ssl_certificate /etc/letsencrypt/live/app.rranzag.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.rranzag.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Apply limits
    limit_conn addr 10;
    limit_req zone=scanning burst=20 nodelay;
    # ===========================================================

    # ============= NEW: Block bad user agents =============
    # Block known malicious bots and scanners
    if ($http_user_agent ~* (zgrab|python-requests|go-http-client|nikto|sqlmap|nmap|masscan|dirbuster|gobuster|wfuzz)) {
        return 403;
    }

    # Block empty user agents (often scanners)
    if ($http_user_agent = "") {
        return 403;
    }
    # ======================================================

    # 🔒 SECURITY RULES - Block exploit scanners (added: 20260311)
    location ~* /(vendor|phpunit|\.env|\.git|eval-stdin\.php|admin/config\.php) {
        deny all;
        return 404;
    }

    # ============= NEW: Block path traversal attempts =============
    # Block requests containing ../ or ../
    location ~* \.\./ {
        deny all;
        return 403;
    }

    # Block URL-encoded path traversal (%2e = .)
    location ~* %2e {
        deny all;
        return 403;
    }

    # Block cgi-bin access explicitly
    location ~* /cgi-bin/ {
        deny all;
        return 403;
    }
    # =============================================================

    # ============= NEW: Block common WordPress/Joomla scans =============
    location ~* (wp-admin|wp-content|wp-includes|xmlrpc\.php|wp-login\.php|wp-config|wp-json|joomla|drupal|wordpress) {
        deny all;
        return 404;
    }
    # ===================================================================

    # ============= NEW: Block suspicious query strings =============
    # SQL injection attempts
    if ($query_string ~* "union.*select.*\(") {
        return 403;
    }

    if ($query_string ~* "concat.*\(") {
        return 403;
    }

    if ($query_string ~* "eval.*\(") {
        return 403;
    }
    # ===============================================================

    # Serve default Nginx page at root
    location = / {
        root /var/www/html;
        index index.nginx-debian.html;
    # Apply basic request limiting
        limit_req zone=http_burst burst=10 nodelay;
        limit_conn addr 5;
    }

    # Existing proxy for /lac/ (ai-lac-05)
    location /lac/ {
        # Apply API rate limiting to this endpoint
        limit_req zone=api burst=30 nodelay;

        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Add timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # NEW: Proxy for /wally/ (wally-ai-00)
    location /wally/ {
        # Apply API rate limiting to this endpoint
        limit_req zone=api burst=30 nodelay;

        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Add timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    # NEW: Proxy for /icepeda/ (ai-icepeda-02)
    location /icepeda/ {
        # Apply API rate limiting to this endpoint
        limit_req zone=api burst=30 nodelay;

        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Add timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    # Optional: health check for /lac/
    location /lac/health {
        # Allow more frequent health checks
        limit_req zone=api burst=60 nodelay;
        proxy_pass http://localhost:3001/health;
    }
    # NEW: health check for /wally/
    location /wally/health {
        limit_req zone=api burst=60 nodelay;
        proxy_pass http://localhost:3002/health;
    }
    # NEW: health check for /icepeda/
    location /icepeda/health {
        limit_req zone=api burst=60 nodelay;
        proxy_pass http://localhost:3003/health;
    }

    # ============= NEW: Block favicon.ico spam =============
    location = /favicon.ico {
        access_log off;
        log_not_found off;
        expires 90d;
        return 204;  # No content, reduces load
    }
    # =======================================================

    # Optional: custom error page
    error_page 502 503 504 /custom_50x.html;
    location = /custom_50x.html {
        root /var/www/html;
    }

    # ============= NEW: Add security headers =============
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # =====================================================
}