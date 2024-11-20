import { useEffect, useState } from "react";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export function useMercadoPagoSDK(publicKey: string) {
  const [mercadoPago, setMercadoPago] = useState<
    typeof window.MercadoPago | null
  >(null);

  useEffect(() => {
    if (window.MercadoPago) {
      setMercadoPago(window.MercadoPago);
      return;
    }
  
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => {
      if (window.MercadoPago) {
        setMercadoPago(new window.MercadoPago(publicKey));
      }
    };
    script.onerror = () => console.error("Error al cargar el SDK de MercadoPago.");
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [publicKey]);
  

  return mercadoPago;
}
