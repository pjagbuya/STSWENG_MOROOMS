import HeaderNavLink from './header_navlink';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/server';
import { isAdminServerSide } from '@/utils/utils';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = user !== null;
  const isAdmin = await isAdminServerSide();

  return (
    <header className="sticky top-0 flex items-center gap-8 bg-black px-4 py-2.5 drop-shadow-md">
      <div className="flex items-center gap-3 text-white">
        <Image src="/logo.png" width={50} height={50} alt="MoRooms Logo" />
        <h1 className="select-none text-2xl font-bold">MoRooms</h1>
      </div>

      <nav className="flex-1">
        <HeaderNavLink link="/">Home</HeaderNavLink>
        <HeaderNavLink link="/todo">Profile</HeaderNavLink>
        <HeaderNavLink link="/rooms">
          {isAdmin ? 'Reservations / Manage Rooms' : 'Reservations'}
        </HeaderNavLink>

        {isAdmin && (
          <>
            <HeaderNavLink link="/todo">Manage Reservations</HeaderNavLink>
            <HeaderNavLink link="/todo">Manage Users</HeaderNavLink>
          </>
        )}
      </nav>

      <div className="flex gap-3">
        {isLoggedIn ? (
          <>
            <Link href="/profile">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <Button
              asChild
              className="hover:brightness-110 active:brightness-75"
            >
              <Link href="/signup">
                <Mail className="w-11 text-white" />
              </Link>
            </Button>
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
