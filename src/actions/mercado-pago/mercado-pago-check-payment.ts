"use server";

import prisma from "@/lib/prisma";

export async function checkPaymentAndUpdateOrder(paymentId: string) {
  try {
    // Consultar los detalles del pago a la API de Mercado Pago
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    ).then((res) => res.json());

    if (paymentResponse.status === "approved") {
      const orderId = paymentResponse.external_reference;

      // Actualizar la orden en la base de datos
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });

      return { success: true };
    } else {
      return {
        success: false,
        message: `Payment not approved. Status: ${paymentResponse.status}`,
      };
    }
  } catch (error) {
    console.error("Error checking payment:", error);
    return { success: false, message: "Error checking payment" };
  }
}
