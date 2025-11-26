import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import ReservationTable from '@/components/reservation/reservation_table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserRoleServerSide } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function ReservationCardList() {
  const userInfo = await getCurrentUserInfo();
  const userRole = await getUserRoleServerSide();

  // Determine the mode based on the user's role (server-side)
  const getReservationMode = () => {
    if (userRole === 'ADMIN') return 'edit';
    if (userRole === 'ROOM_MANAGER' || userRole === 'USER') return 'user';
    return null; // Invalid access
  };

  const mode = getReservationMode();

  return (
    <>
      <Header />
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Image
          src="/images/Login-bg.png"
          alt="DLSU classroom"
          layout="fill"
          className="absolute -z-10 opacity-50"
        />
        <div className="container flex w-full flex-col p-8">
          <h1 className="mb-5 text-2xl font-bold">Reservation Management</h1>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-4 rounded-lg bg-white p-8 shadow-md">
              {mode ? (
                <ReservationTable userId={userInfo.userId} mode={mode} />
              ) : (
                <div className="p-6">
                  Error Invalid Access.
                  <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Go to Homepage
                  </Link>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
