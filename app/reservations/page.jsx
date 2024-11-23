import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import ReservationTable from '@/components/reservation/reservation_table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isAdminServerSide } from '@/utils/utils';
import Image from 'next/image';
import React from 'react';

export default async function ReservationCardList() {
  const userInfo = await getCurrentUserInfo();
  const isAdmin = await isAdminServerSide();

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
              <ReservationTable
                userId={userInfo.userId}
                mode={isAdmin ? 'admin' : 'user'}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

// Sample data
// const sampleReservations = [
//     {
//       status: 'Accepted',
//       requestDate: '2023-06-01T10:00:00Z',
//       roomName:
//         'Conference Room A Located at Henry Sy. Hall Of De La Salle University Taft Ave.',
//       reservationCount: 10,
//       reservationTime: [['2023-06-15T09:00:00Z', '2023-06-15T11:00:00Z']],
//       reservationPurpose: 'Team Meeting',
//       endorsementLetter: true,
//     },
//     {
//       status: 'Pending',
//       requestDate: '2023-06-02T14:30:00Z',
//       roomName: 'Auditorium',
//       reservationCount: 50,
//       reservationTime: [['2023-06-20T13:00:00Z', '2023-06-20T17:00:00Z']],
//       reservationPurpose: 'Company Presentation',
//       endorsementLetter: false,
//     },
//     {
//       status: 'Waitlisted',
//       requestDate: '2023-06-03T09:15:00Z',
//       roomName: 'Meeting Room B',
//       reservationCount: 5,
//       reservationTime: [
//         ['2023-06-18T10:00:00Z', '2023-06-18T11:00:00Z'],
//         ['2023-06-19T14:00:00Z', '2023-06-19T15:00:00Z'],
//       ],
//       reservationPurpose:
//         "Client Meeting Very important, please accept ASAP or else we'll all get fired and you'll be at a loss",
//       endorsementLetter: true,
//     },
//     {
//       status: 'Cancelled',
//       requestDate: '2023-06-04T16:45:00Z',
//       roomName: 'Board Room',
//       reservationCount: 8,
//       reservationTime: [['2023-06-22T09:00:00Z', '2023-06-22T12:00:00Z']],
//       reservationPurpose: 'Strategy Planning',
//       endorsementLetter: true,
//     },
//   ];
