import { titleFont } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="flex md:flex-col h-[800px] w-full justify-center items-center align-middle">
      
      <div className="text-center px-5 mx-5 mb-3">
        <h2 className={`${titleFont.className} antialiased text-9xl`}>404</h2>
        <p className="font-semibold text-xl">Ops! Lo sentimos!</p>
        <p className="font-light">
            <span>Puedes regresar al </span>
            <Link
                href="/"
                className='font-normal hover:underline transition-all'
            >inicio</Link>
        </p>
      </div>

      <div className="px-5 mx-5">
        <Image
            src="/imgs/logo.png"
            alt="chu-logo"
            className="p-5 sm:p-0"
            width={400}
            height={400}
        />
      </div>

      <div>
        <Link href="/">Regresar al inicio</Link>
      </div>


    </div>
  );
}