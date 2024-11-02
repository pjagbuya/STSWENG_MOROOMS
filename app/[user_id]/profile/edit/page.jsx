import { getUserInfo } from './action';
import { SignupEditForm } from '@/components/signup-edit-form';
import Image from 'next/image';

export default async function Page({ params }) {
  const { user_id: userId } = params;
  const {
    user_firstname: userFirstName,
    user_lastname: userLastName,
    user_school_id: userSchoolId,
  } = (await getUserInfo(userId))[0];
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Image
        src="/images/Login-bg.png"
        alt="DLSU classroom"
        layout="fill"
        className="absolute -z-10 opacity-50"
      />
      <SignupEditForm
        userFirstName={userFirstName}
        userLastName={userLastName}
        userSchoolId={userSchoolId}
      />
    </div>
  );
}
