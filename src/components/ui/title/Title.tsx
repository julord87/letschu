import { titleFont } from "@/config/fonts";
import Image from "next/image";

interface Props {
  title: string;
  subtitle?: string | React.ReactNode;
  classname?: string;
}

export default function Title({ title, subtitle, classname }: Props) {
  return (
    <div className={`mt-3`}>
      <a href="/">
        <Image
          src="/imgs/logo.png"
          alt="logo"
          width={250}
          height={250}
          className="inline-block cursor-pointer my-4"
        />
      </a>
      
      <h1 className={ `${ titleFont.className } capitalize antialiased text-4xl font-semibold mt-7 mb-4` }>
        { title }
      </h1>

      <span>{subtitle && <h3 className="text-xl mb-6">{subtitle}</h3>}</span>
    </div>

  );
}
