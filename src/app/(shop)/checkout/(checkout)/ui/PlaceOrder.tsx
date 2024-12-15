"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/helpers/currencyFormat";
import { useShippingMethodStore } from "@/store/shipping/shipping-method-store";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Datos de la dirección y el carrito
  const address = useAddressStore((state) => state.address);
  const { shippingMethod, shippingProductId } = useShippingMethodStore(
    (state) => ({
      shippingMethod: state.shippingMethod,
      shippingProductId: state.shippingProductId,
    })
  );

  const { totalItems, subtotal, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Efecto para cargar el estado inicial
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Manejar la acción de realizar la orden
  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage("");

    // Preparar productos para la orden
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      color: product.color,
    }));

    // Llamar a la acción del servidor, incluyendo el shippingMethod
    const resp = await placeOrder(
      productsToOrder,
      address,
      shippingMethod,
      shippingProductId
    ); // Pasar ID del producto de envío

    // Limpiar carrito y redirigir
    if (resp.ok) {
      clearCart();
      setTimeout(() => {
        // Redirigir usando window.location
        window.location.href = `/orders/${resp.order?.id}`;
      }, 0);
      return;
    }
    // Manejar error si la respuesta no es exitosa
    setIsPlacingOrder(false);
    setErrorMessage(resp.message || "An unexpected error occurred");
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2 font-bold">Dirección</h2>
      <div className="mb-4">
        <p className="text-xl mb-1">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.province}, {address.country}
        </p>
        <p>{address.zip}</p>
        <p>{address.phone}</p>
      </div>

      <p className="mb-5 font-semibold">
        Método de envío:
        {shippingMethod === "showroom"
          ? " retiro en showroom"
          : shippingMethod === "argentina"
          ? " envío a domicilio nacional"
          : " envío internacional a domicilio"}
      </p>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-200 rounded mb-10"></div>

      <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">{totalItems}</span>

        <span>Subtotal</span>
        <span className="text-right">${currencyFormat(subtotal)}</span>

        <span className="text-sm mt-3">Costo de envío</span>
        <span className="text-right text-sm mt-3">
          {shippingMethod === "showroom"
            ? "Gratis"
            : shippingMethod === "argentina"
            ? "*El costo de envío se calculará al momento de pagar"
            : "Calculado según la dirección internacional"}
        </span>

        <span className="text-lg mt-5 font-semibold">Total</span>
        <span className="text-lg mt-5 text-right font-semibold">
          ${currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Realizar pago&quot;, aceptas los{" "}
            <a href="/terms-and-conditions" className="underline">
              términos y condiciones
            </a>
          </span>
        </p>

        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>

        <button
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Realizar pago
        </button>
      </div>
    </div>
  );
};
