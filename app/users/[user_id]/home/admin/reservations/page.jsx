import ReservationTable from '@/components/reservation_table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

// Sample data
const sampleReservations = [
  {
    status: 'Accepted',
    requestDate: '2023-06-01T10:00:00Z',
    roomName:
      'Conference Room A Located at Henry Sy. Hall Of De La Salle University Taft Ave.',
    reservationCount: 10,
    reservationTime: [['2023-06-15T09:00:00Z', '2023-06-15T11:00:00Z']],
    reservationPurpose: 'Team Meeting',
    endorsementLetter: true,
  },
  {
    status: 'Pending',
    requestDate: '2023-06-02T14:30:00Z',
    roomName: 'Auditorium',
    reservationCount: 50,
    reservationTime: [['2023-06-20T13:00:00Z', '2023-06-20T17:00:00Z']],
    reservationPurpose: 'Company Presentation',
    endorsementLetter: false,
  },
  {
    status: 'Waitlisted',
    requestDate: '2023-06-03T09:15:00Z',
    roomName: 'Meeting Room B',
    reservationCount: 5,
    reservationTime: [
      ['2023-06-18T10:00:00Z', '2023-06-18T11:00:00Z'],
      ['2023-06-19T14:00:00Z', '2023-06-19T15:00:00Z'],
    ],
    reservationPurpose:
      "Client Meeting Very important, please accept ASAP or else we'll all get fired and you'll be at a loss",
    endorsementLetter: true,
  },
  {
    status: 'Cancelled',
    requestDate: '2023-06-04T16:45:00Z',
    roomName: 'Board Room',
    reservationCount: 8,
    reservationTime: [['2023-06-22T09:00:00Z', '2023-06-22T12:00:00Z']],
    reservationPurpose: 'Strategy Planning',
    endorsementLetter: true,
  },
];

export default function ReservationCardList() {
  return (
    <div className="container flex w-full flex-col p-8">
      <h1 className="mb-5 text-2xl font-bold">Reservation Management</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4">
          <ReservationTable reservations={sampleReservations} />
        </div>
      </ScrollArea>
    </div>
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
