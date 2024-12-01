import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import Recommender from '@/components/home/recommender';
import ReservationTable from '@/components/reservation/reservation_table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { get_all_details } from '@/lib/get_all_details';
import Image from 'next/image';

export default async function Home() {
  const userInfo = await getCurrentUserInfo();
  const details = await get_all_details(userInfo.userId);
  console.log('frotnend details:', details);

  return (
    <div className="flex min-h-screen flex-col">
      <Header className="relative z-20" />
      <Image
        src="/images/Login-bg.png"
        alt="DLSU classroom"
        layout="fill"
        className="absolute inset-0 -z-10 object-cover opacity-50"
      />
      {/* Background overlay */}
      <div className="absolute inset-0 -z-10 bg-black opacity-40"></div>
      <main className="relative flex-grow">
        <ScrollArea className="h-[calc(100vh-72px)]">
          <div className="container mx-auto space-y-8 px-4 py-8">
            {/* Title + Logo */}
            <div className="flex flex-col items-center justify-center space-y-4 py-64">
              <div className="flex items-center space-x-4">
                <Image
                  src="/logo-updated2.png"
                  alt="Logo"
                  width={350} // Set appropriate dimensions for your logo
                  height={350}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-8xl font-bold text-white">MoRooms</h1>
                  <p className="text-3xl font-medium text-white">
                    Reserve, Schedule, Explore.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="w-full bg-white p-8 shadow-md">
            <h2 className="mb-5 text-4xl font-bold">Recommended Rooms</h2>
            <Recommender userID={userInfo.userId} />
          </div>
          <div className="mt-8">
            <h2 className="p-8 text-4xl font-bold text-white">
              Reservations for the Week
            </h2>
            <div className="container mx-auto space-y-8 px-4 py-8">
              <div className="rounded-lg bg-white p-8 shadow-md">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <ReservationTable userId={userInfo.userId} mode={'user'} />
                  {/* TODO: add userID and if mode is admin or user */}
                </ScrollArea>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
