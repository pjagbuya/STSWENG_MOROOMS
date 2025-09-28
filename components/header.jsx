import HeaderNavLink from './header_navlink';
import SignOutButton from './signout_btn';
import { Button } from './ui/button';
import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/server';
import { isAdminServerSide, isProfServerSide } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = user !== null;
  const isAdmin = await isAdminServerSide();

  const isProf = await isProfServerSide();
  const userInfo = await getCurrentUserInfo();

  return (
    <header className="sticky top-0 z-50 flex items-center gap-8 bg-black px-4 py-2.5 drop-shadow-md">
      <div className="flex items-center gap-3 text-white">
        <Image src="/logo.png" width={50} height={50} alt="MoRooms Logo" />
        <h1 className="select-none text-2xl font-bold">MoRooms</h1>
      </div>

      <nav className="flex-1">
        <HeaderNavLink link="/">Home</HeaderNavLink>
        <HeaderNavLink link={`/users/${userInfo.userId}/profile`}>
          {'Profile'}
        </HeaderNavLink>
        <HeaderNavLink link="/rooms">
          {isAdmin || isProf ? 'Reservations / Manage Rooms' : 'Reservations'}
        </HeaderNavLink>

        {isAdmin && (
          <>
            <HeaderNavLink link="/manage/reservations">
              Manage Reservations
            </HeaderNavLink>
            <HeaderNavLink link={`/users/${userInfo.userId}/home/admin/users`}>
              Manage Users
            </HeaderNavLink>
            <HeaderNavLink link={'/logger'}>View Logs</HeaderNavLink>
          </>
        )}
      </nav>

      <div className="flex gap-3">
        {isLoggedIn ? (
          <>
            <Link href={`/users/${userInfo.userId}/profile`}>
              <Avatar>
                <AvatarImage src={userInfo.profileURL} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <SignOutButton />
          </>
        ) : (
          <>
            <Button
              asChild
              className="hover:brightness-110 active:brightness-75"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="border border-white hover:brightness-110 active:brightness-75"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
