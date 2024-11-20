import prisma from "@/lib/prisma";

export async function createMercadoPagoPreference(orderId: string) {
  // 1. Obtén la orden y sus items desde Prisma
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      OrderItem: {
        include: {
          product: true,
        },
      },
      user: true, // Incluye información del usuario
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 2. Busca la dirección de la orden en OrderAddress
  const orderAddress = await prisma.orderAddress.findUnique({
    where: { orderId: order.id },
    include: {
      country: true,
    },
  });

  if (!orderAddress) {
    throw new Error("Order address not found");
  }

  // 3. Construye los datos para la preferencia de MercadoPago
  const preferenceData = {
    items: order.OrderItem.map((item) => ({
      title: item.product.title,
      unit_price: item.price,
      quantity: item.quantity,
      currency_id: "ARS",
    })),
    payer: {
      name: orderAddress.firstName || "Cliente",
      surname: orderAddress.lastName || "",
      email: order.user.email,
      phone: {
        number: orderAddress.phone?.toString() || "",
      },
      address: {
        zip_code: orderAddress.zip,
        street_name: `${orderAddress.address} ${orderAddress.address2 || ""}`,
        city: orderAddress.city,
      },
    },
    external_reference: orderId,
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`, // Redirige a una página de éxito personalizada
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/error`, // Redirige a una página de fallo
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`, // Redirige a una página de espera
    },
    auto_return: "approved",
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook`, // URL de webhook para recibir notificaciones de pago
  };

  // 4. Llama a la API de MercadoPago para crear la preferencia
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferenceData),
  });
  
  if (!response.ok) {
    console.error("Error al crear preferencia", await response.json());
    throw new Error("No se pudo crear la preferencia de Mercado Pago.");
  }
  
  const preference = await response.json();
  return { preferenceId: preference.id };  
}
