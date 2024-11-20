import { NextResponse } from 'next/server';
import { checkPaymentAndUpdateOrder } from '@/actions';
import crypto from 'crypto';

// Obtener la clave secreta desde las variables de entorno
const MERCADO_PAGO_SECRET = process.env.MERCADO_PAGO_SECRET;
if (!MERCADO_PAGO_SECRET) {
  throw new Error("MERCADO_PAGO_SECRET is not defined in environment variables");
}

// Exportar la función POST como una exportación nombrada
export async function POST(req: Request) {
  // Obtener la firma de la cabecera (x-signature)
  const signature = req.headers.get('x-signature');

  if (!signature) {
    return NextResponse.json({ message: "No signature header provided" }, { status: 400 });
  }

  // Obtener el cuerpo de la solicitud
  const body = await req.json();

  // Verificar la firma
  const isValidSignature = verifySignature(body, signature);

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  // Extraer el id y el tipo del cuerpo
  const { id, type } = body;

  if (!id || !type) {
    return NextResponse.json({ message: "Missing required fields 'id' or 'type'" }, { status: 400 });
  }

  if (type === "payment") {
    queueMicrotask(async () => {
      try {
        await checkPaymentAndUpdateOrder(id);
        console.log(`Orden actualizada correctamente: ${id}`);
      } catch (err) {
        console.error(`Error procesando pago para ${id}:`, err);
      }
    });
  }
  return NextResponse.json({ message: "Evento recibido" }, { status: 200 });
}  

// Función para verificar la firma
function verifySignature(body: any, signature: string): boolean {
  // Convertir el cuerpo a string (asegurarse de que sea consistente con la firma enviada)
  const payload = JSON.stringify(body);

  // Crear el hash de la solicitud usando SHA256 y la clave secreta
  if (!MERCADO_PAGO_SECRET) {
    throw new Error("MERCADO_PAGO_SECRET is not defined");
  }

  const computedSignature = crypto
    .createHmac('sha256', MERCADO_PAGO_SECRET)
    .update(payload)
    .digest('hex');

  // Comparar la firma calculada con la firma enviada por MercadoPago
  return computedSignature === signature;
}
