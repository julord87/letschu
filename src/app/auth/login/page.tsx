import { titleFont } from '@/config/fonts';
import Image from 'next/image';
import { LoginForm } from './ui/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <div className="px-5 mx-5">
        <Image
          src="/imgs/logo.png"
          alt="chu-logo"
          className="p-5 sm:p-0 mb-10"
          width={400}
          height={400}
        />
      </div>

      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

      <LoginForm />
    </div>
  );
}