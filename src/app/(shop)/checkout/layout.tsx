import { redirect } from "next/navigation";
import { auth } from "../../../auth.config";

export default async function CheckoutLayout({ children }: {
 children: React.ReactNode;
}) {

    const session = await auth();

    if (!session?.user) {
        redirect('/auth/login?redirctTo=/checkout/address');
    }

  return (
    <>
        {children}
    </>
  );
}