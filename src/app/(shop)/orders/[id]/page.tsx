import { convertToUSD, createMercadoPagoPreference, getOrderById, sendOrderConfirmationEmail } from "@/actions";
import { OrderStatus, PayPalButton } from "@/components";
import Title from "@/components/ui/title/Title";
import { currencyFormat } from "@/helpers/currencyFormat";
import Image from "next/image";
import { redirect } from "next/navigation";
import MercadoPagoButton from "./components/MercadoPagoButton";

interface Props {
  params: {
    id: string
  }
}

export default async function OrdersByIdPage({ params }: Props) {

  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const { preferenceId } = await createMercadoPagoPreference(order!.id);

  if(order?.isPaid) {
    await sendOrderConfirmationEmail(order!.id);
  }

  const address = order!.OrderAddress;

  // Convertir el monto total a USD
  let convertedAmount: number | null = null;
  let conversionError = null;

  try {
    const USDOrderResult = await convertToUSD(order!.total);
    if (USDOrderResult.ok) {
      convertedAmount = USDOrderResult.convertedAmount ?? null;
    } else {
      conversionError = USDOrderResult.message;
    }
  } catch (error) {
    conversionError = "Error inesperado al convertir el monto. Inténtalo más tarde.";
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        
        <Title 
          title={`Orden #${id.split("-")[0]}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

          <OrderStatus isPaid={order?.isPaid ?? false} />
        

            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.color}
                className="flex mb-5"
              >
                <Image
                  src={item.product.ProductImage[0].url}
                  alt={item.product.title}
                  width={130}
                  height={130}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  className="mr-5 rounded object-cover"
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden*/}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.zip}</p>
              <p>
                {address!.city}, {address!.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-200 rounded mb-10">

            </div>

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1
                  ? "1 artículo"
                  : `${order?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subtotal)}</span>

              <span className="text-2xl mt-5 font-semibold">Total</span>
              <span className="text-2xl mt-5 text-right font-semibold">{currencyFormat(order!.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : conversionError ? (
                // Mostrar mensaje de error si la conversión falla
                <p className="text-red-500 text-center">{conversionError}</p>
              ) : (
                // Renderizar PayPalButton con el monto convertido
                <PayPalButton amount={convertedAmount!} orderId={order!.id} />
              )}
                <MercadoPagoButton preferenceId={preferenceId} />
            </div>

          </div>

        </div>
        
      </div>
    </div>
  );
}