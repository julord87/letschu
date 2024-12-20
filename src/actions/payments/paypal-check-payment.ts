"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export const payPalCheckPayment = async ( payPalTransactionId: string) => {

    const authTOken = await getPayPalBearerToken();
    console.log("authTOken:", authTOken);
    if( !authTOken ) {
        return {
            ok: false,
            message: "Error al obtener el token de autenticación"
        }
    }

    const resp = await verifyPayPalPayment(payPalTransactionId, authTOken);

    if( !resp ) {
        return {
            ok: false,
            message: "Error al verificar el pago con PayPal"
        }
    }

    const { status, purchase_units } = resp;
    const {  invoice_id: orderId } = purchase_units[0]

    if( status !== "COMPLETED" ) {
        return {
            ok: false,
            message: "El pago no fue completado"
        }
    }

    try {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        revalidatePath(`/orders/${orderId}`);

        return {
            ok: true,
        }

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: "500 - Error al verificar el pago con PayPal"
        }
    }

}

const getPayPalBearerToken = async (): Promise<string | null> => {

    const base64Token = Buffer.from(
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
        "utf-8"
    ).toString("base64");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
        const response = await fetch(`${process.env.PAYPAL_OAUTH_URL}`, {
            ...requestOptions,
            cache: "no-store"
        }).then((res) => res.json());
        return response.access_token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const verifyPayPalPayment = async (
    payPalTransactionId: string, 
    bearerToken: string
    ): Promise<PayPalOrderStatusResponse | null> => {
    const payPalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${payPalTransactionId}`;
    
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    
    try {
        const response = await fetch(payPalOrderUrl, {
            ...requestOptions,
            cache: "no-store"
        }).then((res) => res.json());
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}