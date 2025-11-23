import { PasswordResetForm } from '@/components/password_reset_form';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Image
        src="/images/Login-bg.png"
        alt="DLSU classroom"
        fill
        className="absolute -z-10 opacity-50"
      />
      <div className="w-full max-w-md">
        <PasswordResetForm />
      </div>
    </div>
  );
}
