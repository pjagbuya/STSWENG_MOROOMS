'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function RoomList({ roomsData }) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {roomsData.map(room => (
          <Card key={room.roomId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {room.roomName}
                <Badge>{room.roomType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Capacity: {room.roomCapacity}</span>
              </div>
              <div className="mb-2 flex items-center">
                <span className="mr-2 font-semibold">Details:</span>
                <span>{room.roomDetails}</span>
              </div>
              <div className="mb-2 flex items-center">
                <span className="mr-2 font-semibold">Opportunities:</span>
                <span>{room.roomOpports}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
