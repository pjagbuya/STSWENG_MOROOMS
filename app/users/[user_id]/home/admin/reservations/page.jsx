import Header from '@/components/header';
import ReservationTable from '@/components/reservation/reservation_table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import React from 'react';

export default function ReservationCardList() {
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
                userId={'bb794c03-711a-41dd-be9a-9b80b3d068fd'}
                mode={'admin'}
              />{' '}
              {/*TODO: add userID and if mode is admin or user*/}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
// <Card key={reservation.id} className="w-full">
//   <CardHeader>
//     <CardTitle className="flex items-center justify-between">
//       <span>{`${reservation.userFirstName} ${reservation.userLastName}`}</span>
//       <Badge
//         variant={
//           reservation.reservationType === 'MEETING'
//             ? 'default'
//             : reservation.reservationType === 'EVENT'
//               ? 'secondary'
//               : 'outline'
//         }
//       >
//         {reservation.reservationType}
//       </Badge>
//     </CardTitle>
//   </CardHeader>
//   <CardContent>
//     <div className="flex justify-between">
//       <div className="space-y-2">
//         <p>
//           <strong>Purpose:</strong> {reservation.reservationPurpose}
//         </p>
//         <p>
//           <strong>Attendees:</strong> {reservation.reservationCount}
//         </p>
//       </div>
//       <div className="space-y-2 text-right">
//         <div>
//           <strong>Time:</strong>
//           {reservation.reservationTime.map((time, index) => (
//             <div key={index} className="text-sm">
//               {time[0].toLocaleString()} -{' '}
//               {time[1].toLocaleString()}
//             </div>
//           ))}
//         </div>
//         <p>
//           <strong>Sharing:</strong>{' '}
//           {reservation.reservationIsSharing ? 'Yes' : 'No'}
//         </p>
//       </div>
//     </div>
//     <div className="mt-5 flex justify-end">
//       <div className="flex w-[400px] gap-4">
//         <Button type="submit" className="w-full">
//           Approve Reservation
//         </Button>

//         <Button type="submit" variant="outline" className="w-full">
//           Reject Reservation
//         </Button>
//       </div>
//     </div>
//   </CardContent>
// </Card>
