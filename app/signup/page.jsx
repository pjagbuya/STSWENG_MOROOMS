import { Signup } from '@/components/signup-form';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Image
        src="/images/Login-bg.png"
        alt="DLSU classroom"
        layout="fill"
        className="absolute -z-10 opacity-50"
      />
      <Signup />
    </div>
  );
}
