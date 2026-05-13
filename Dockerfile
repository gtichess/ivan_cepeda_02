# THIS IS THE BASE IMAGE FOR THE BOT
FROM node:22-bullseye-slim AS builder

# Install git and other required build dependencies
RUN apt-get update && \
    apt-get install -y git python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Enable Corepack and prepare PNPM to increase performance
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin
ENV PATH="$PNPM_HOME:$PATH"

# Set the working directory
WORKDIR /app

# Copy manifest and lockfile first (cache-friendly)
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using PNPM (use frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# Create a new stage for deployment
FROM node:22-bullseye-slim AS deploy

# Set working dir
WORKDIR /app

# Install only runtime dependencies (keep final image small)
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Enable Corepack and prepare PNPM in deploy stage so pnpm is available
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin
ENV PATH="$PNPM_HOME:$PATH"

# Copy only necessary files and artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public

# Install production dependencies using pnpm
RUN pnpm install --prod --frozen-lockfile

# Start the app
CMD ["pnpm", "start"]
