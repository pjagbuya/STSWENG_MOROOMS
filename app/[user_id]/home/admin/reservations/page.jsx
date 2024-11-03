import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

const reservations = [
  {
    id: 1,
    userFirstName: 'John',
    userLastName: 'Doe',
    reservationTime: [
      [new Date('2023-06-01T09:00:00'), new Date('2023-06-01T10:00:00')],
    ],
    reservationPurpose: 'Team Meeting',
    reservationType: 'MEETING',
    reservationIsSharing: false,
    reservationCount: 5,
  },
  {
    id: 2,
    userFirstName: 'Jane',
    userLastName: 'Smith',
    reservationTime: [
      [new Date('2023-06-02T14:00:00'), new Date('2023-06-02T16:00:00')],
      [new Date('2023-06-03T10:00:00'), new Date('2023-06-03T12:00:00')],
    ],
    reservationPurpose: 'Conference',
    reservationType: 'EVENT',
    reservationIsSharing: true,
    reservationCount: 50,
  },
  {
    id: 3,
    userFirstName: 'Alice',
    userLastName: 'Johnson',
    reservationTime: [
      [new Date('2023-06-04T11:00:00'), new Date('2023-06-04T12:00:00')],
    ],
    reservationPurpose: 'Personal Appointment',
    reservationType: 'PERSONAL',
    reservationIsSharing: false,
    reservationCount: 1,
  },
];

export default function ReservationCardList() {
  return (
    <div className="container flex w-full flex-col p-8">
      <h1 className="mb-5 text-2xl font-bold">Reservation Management</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4">
          {reservations.map(reservation => (
            <Card key={reservation.id} className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{`${reservation.userFirstName} ${reservation.userLastName}`}</span>
                  <Badge
                    variant={
                      reservation.reservationType === 'MEETING'
                        ? 'default'
                        : reservation.reservationType === 'EVENT'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {reservation.reservationType}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <p>
                      <strong>Purpose:</strong> {reservation.reservationPurpose}
                    </p>
                    <p>
                      <strong>Attendees:</strong> {reservation.reservationCount}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div>
                      <strong>Time:</strong>
                      {reservation.reservationTime.map((time, index) => (
                        <div key={index} className="text-sm">
                          {time[0].toLocaleString()} -{' '}
                          {time[1].toLocaleString()}
                        </div>
                      ))}
                    </div>
                    <p>
                      <strong>Sharing:</strong>{' '}
                      {reservation.reservationIsSharing ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <div className="flex w-[400px] gap-4">
                    <Button type="submit" className="w-full">
                      Approve Reservation
                    </Button>

                    <Button type="submit" variant="outline" className="w-full">
                      Reject Reservation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
