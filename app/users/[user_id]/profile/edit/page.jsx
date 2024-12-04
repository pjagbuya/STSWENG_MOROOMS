import { getUserInfo } from './action';
import Header from '@/components/header';
import { Signup } from '@/components/signup-form';
import Image from 'next/image';

export default async function EditProfilePage() {
  const userInfo = await getUserInfo();
  delete userInfo.userId;
  return (
    <div>
      <Header />
      <div className="flex h-screen w-full items-center justify-center bg-opacity-25 bg-[url('/images/Login-bg.png')] bg-cover bg-no-repeat px-4">
        <div className="fixed inset-0 bg-gray-300 opacity-70"></div>

        <div className="relative z-20">
          <Signup defaultValues={userInfo} isEdit={true} />
        </div>
      </div>
    </div>
  );
}
