"use server";

import { auth } from "@/auth.config";
import { Address, Colors } from "@/interfaces";
import prisma from "@/lib/prisma";
import { calculateShippingCostCorreo } from "../shipping/calculate-shipping-cost-correo";

interface ProductToOrder {
  productId: string;
  quantity: number;
  color?: Colors; // Hacer color opcional
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
  shippingMethod: "argentina" | "international" | "showroom",
  shippingProductId?: string
): Promise<{
  ok: boolean;
  order?: any;
  breakdown?: {
    subtotal: number;
    shippingCost: number;
    total: number;
  };
  message?: string;
}> => {
  console.log("placeOrder called with:", {
    productIds,
    address,
    shippingMethod,
  });

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario activa",
    };
  }

  let shippingCost = 0;

  // Calcular el costo de envío según el método
  if (shippingMethod === "argentina") {
    const correoResult = await calculateShippingCostCorreo({
      cpOrigen: "1070", // Código postal de origen predeterminado
      provinciaOrigen: "AR-C", // Provincia de origen predeterminada
      cpDestino: address.zip,
      provinciaDestino: address.province ?? address.city, // Valor predeterminado para provincia
      peso: 0.40, // Peso predeterminado para el cálculo
    });
  
    if (typeof correoResult === "string") {
      return {
        ok: false,
        message: correoResult, // Error en el cálculo del costo
      };
    }
  
    shippingCost = correoResult.aDomicilio;
  } else if (shippingMethod === "international") {
    if (shippingMethod === "international") {
      if (!shippingProductId) {
        return {
          ok: false,
          message: "Falta el ID del producto de envío para envíos internacionales.",
        };
      }
    
      const shippingProduct = await prisma.product.findUnique({
        where: { id: shippingProductId },
        include: { category: true }, // Cargar la categoría asociada
      });
    
      if (!shippingProduct || shippingProduct.category?.name !== "envios") {
        return {
          ok: false,
          message: "El producto de envío no es válido.",
        };
      }
      shippingCost = shippingProduct.price;

      // Eliminar producto de envío del carrito
      const updatedProductIds = productIds.filter((item) => item.productId !== shippingProductId);
      productIds = updatedProductIds;
    }
  } else {
    // Showroom: envío gratis
    shippingCost = 0;
  }

  // Validar productos en el carrito
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map(({ productId }) => productId),
      },
    },
  });

  if (products.length !== productIds.length) {
    return {
      ok: false,
      message: "Uno o más productos en el carrito no existen.",
    };
  }

  // Calcular subtotales y totales
  const { subTotal } = productIds.reduce(
    (totals, item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      totals.subTotal += product.price * item.quantity;
      return totals;
    },
    { subTotal: 0 }
  );

  const orderItems = productIds.map((p) => {
    const colorValue = p.color ?? undefined; // Cambiar null a undefined si no es permitido
    return {
      quantity: p.quantity,
      color: colorValue,
      productId: p.productId,
      price: products.find((pr) => pr.id === p.productId)?.price ?? 0,
    };
  });

  const total = subTotal + shippingCost;

  // Realizar transacción en Prisma
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Crear orden
      const order = await tx.order.create({
        data: {
          userId,
          subtotal: subTotal,
          total,
          itemsInOrder: productIds.reduce((count, p) => count + p.quantity, 0),
          shippingMethod,
          shippingCost,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                color: p.color ?? null,
                productId: p.productId,
                price: products.find((pr) => pr.id === p.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // Crear dirección asociada a la orden
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2 || null,
          zip: address.zip,
          city: address.city,
          phone: address.phone,
          countryId: address.country,
          provinceId: address.province || null,
          orderId: order.id,
        },
      });

      return { order, orderAddress };
    });

    return {
      ok: true,
      order: prismaTx.order,
      breakdown: {
        subtotal: subTotal,
        shippingCost,
        total,
      },
    };
  } catch (error) {
    console.error("Error en la transacción Prisma:", error);
    return { ok: false, message: "Error interno al procesar la orden." };
  }
};
