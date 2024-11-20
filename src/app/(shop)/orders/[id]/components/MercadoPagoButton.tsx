"use client"

import { useEffect } from "react";
import { useMercadoPagoSDK } from "../hooks/useMercadoPagoSDK";

interface MercadoPagoButtonProps {
  preferenceId: string;
}

export default function MercadoPagoButton({ preferenceId }: MercadoPagoButtonProps) {
  const mp = useMercadoPagoSDK(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

  useEffect(() => {
    let walletInstance: any;
  
    if (mp && preferenceId) {
      walletInstance = mp.bricks().create("wallet", "wallet_container", {
        initialization: { preferenceId },
        settings: { locale: "es-AR" },
        customization: { visual: { buttonBackground: "black", borderRadius: "8px" } },
        callbacks: {
          onReady: () => console.log("Botón listo."),
          onError: (error: any) => console.error("Error:", error),
        },
      });
    }
  
    return () => {
      walletInstance?.unmount();
    };
  }, [mp, preferenceId]);
  

  return <div id="wallet_container"></div>;
}

