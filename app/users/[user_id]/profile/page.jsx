import { getCurrentUserInfo, getLastLogin } from './action';
import ProfileCalender from './profile-calendar';
import GradientBox from '@/components/gradient-box';
import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { isAdminServerSide } from '@/utils/utils';
import { ExternalLink, MailOpen, Mails, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const isAdmin = await isAdminServerSide();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userInfo = await getCurrentUserInfo();
  const lastLogin = await getLastLogin(user.email);

  return (
    <div>
      <Header />
      <div className="flex h-screen w-full flex-col items-center justify-center gap-10 px-64 py-24">
        <div className="flex h-[300px] w-full items-center justify-between gap-6 py-6">
          <div className="flex w-full gap-5 rounded-3xl border-8 border-slate-400 bg-slate-200 p-6">
            <Avatar className="h-[211px] w-[211px]">
              <AvatarImage src={userInfo.profileURL} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold">
                {userInfo.userFirstname} {userInfo.userLastname}
              </h1>
              <h3 className="text-lg">{user.email}</h3>
              <h3 className="text-lg">
                Last login:{' '}
                <span className={lastLogin.isError ? 'text-red-500' : ''}>
                  {lastLogin.text}
                </span>
              </h3>
            </div>
          </div>
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-full w-[260px] flex-col gap-3 rounded-md bg-[#EDEDED] p-5">
              <span className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Contact Me</h1>
                <MailOpen />
              </span>
              <div className="flex flex-col gap-3 text-slate-700">
                {/* <span className="flex items-center gap-2">
                <MapPin size={14} />
                <h1 className="text-sm">School</h1>
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink size={14} />
                <h1 className="text-sm">Link</h1>
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} />
                <h1 className="text-sm">Number</h1>
              </span> */}
                <span className="flex items-center gap-2">
                  <Mails size={14} />
                  <h1 className="text-sm">Email: {user.email}</h1>
                </span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href={'./profile/edit'}>Edit Profile</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href={'./profile/rolerequest'}>Request Role Upgrade</Link>
            </Button>
          </div>
        </div>
        {isAdmin ? <AdminHomePageLower /> : <UserHomePageLower />}
      </div>
    </div>
  );
}

function UserHomePageLower() {
  const verticalGradient =
    'linear-gradient(to bottom, #74DB4E 0%, #4696A2 40%, #4E3ABA 100%)';

  return (
    <div className="flex h-[350px] w-full justify-between gap-6">
      <div className="h-full">
        <ProfileCalender />
      </div>
      <Link className="h-full" href={'/rooms'}>
        <div
          className="flex h-full w-[320px] flex-col items-center justify-center rounded-md"
          style={{ backgroundImage: verticalGradient }}
        >
          <div className="flex flex-col gap-1">
            <div className="mb-2 h-5 w-5 rounded-full bg-white"></div>
            <h1 className="text-2xl font-bold text-white">Book a New Room</h1>
            <h3 className="w-[128px] text-[16px] leading-none text-[#E2E8F0]">
              Click here to reserve a new room.
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

function AdminHomePageLower() {
  const gradientOne =
    'linear-gradient(to bottom, #FFF8B5 0%, #C9AB59 40%, #DC4600 100%)';
  const gradientTwo =
    'linear-gradient(to bottom, #FFD7FA 0%, #D33773 40%, #BA3A3A 100%)';
  const gradientThree =
    'linear-gradient(to bottom, #F4B9FF 0%, #7146A2 40%, #4E3ABA 100%)';

  return (
    <div className="flex h-[350px] justify-between gap-6">
      <Link className="h-full" href={'/rooms'}>
        <GradientBox
          gradient={gradientTwo}
          title={'Book a new room'}
          body={'Click here to reserve a new room'}
        />
      </Link>
      <Link className="h-full" href={'./home/admin/reservations'}>
        <GradientBox
          gradient={gradientOne}
          title={'Reservation Management'}
          body={'Click here to manage reservations.'}
        />
      </Link>
      <Link className="h-full" href={'./profile/personal_schedule'}>
        <GradientBox
          gradient={gradientOne}
          title={'Adjust Personal Schedule'}
          body={'Click here to manage personal schedule.'}
        />
      </Link>
      <Link className="h-full" href={'./home/admin/users'}>
        <GradientBox
          gradient={gradientThree}
          title={'Role Settings'}
          body={'Click here to manage roles room.'}
        />
      </Link>
    </div>
  );
}
