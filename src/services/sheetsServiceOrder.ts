import { google } from "googleapis";
import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { config } from "../config";

class SheetManagerOrder {
    private sheets: sheets_v4.Sheets;
    private spreadsheetId: string;

    constructor(spreadsheetId: string, privateKey: string, clientEmail: string) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: privateKey,
                client_email: clientEmail,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        this.sheets = google.sheets({ version: "v4", auth });
        this.spreadsheetId = spreadsheetId;
    }
    async createOrder(order: any, user: string, productId: string, productName: string, productQuantity: string, productPrice: number, totalOrder: number, observation: string, orderDate: string, totalItems: number, deliveryDate: string, address_delivery_charge: number, empaquetagem: string

    ): Promise<void> {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Pedidos!A:M',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[order, user, productId, productName, productQuantity, productPrice, totalOrder, observation, orderDate, totalItems, deliveryDate, address_delivery_charge, empaquetagem]],
                },

            })
            console.log(order);
        } catch (error) {
            console.error("Error al crear pedido:", error);
            throw error; // Propagate error
        }
    }

    async storeUserInfo(user: string, name: string, email: string, address: string): Promise<void> {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'orderUser!A:D',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[user, name, email, address]],
                },
            });
        } catch (error) {
            console.error("Error al almacenar información del cliente:", error);
        }
    }



    async checkUserExists(user: string): Promise<boolean> {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'orderUser!A:A',
            });
            const users = response.data.values || [];
            return users.some(row => row[0] === user);
        } catch (error) {
            console.error("Error checking if user exists:", error);
            return false;
        }
    }

    async getUserInfo(user: string): Promise<{ name: string, email: string, address: string, address_delivery_charge: number }> {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'orderUser!A:E',
            });
            const users = response.data.values || [];
            // console.log('Fetched users:', users);
            console.log('Looking for user:', user);
            const userInfo = users.find(row => row[0] === user);
            if (userInfo) {
                return { name: userInfo[1], email: userInfo[2], address: userInfo[3], address_delivery_charge: userInfo[4] };
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error getting user info:", error);
            throw error;
        }
    }
}
export default new SheetManagerOrder(
    config.spreadsheetIdOrder,
    config.privateKey,
    config.clientEmail
);