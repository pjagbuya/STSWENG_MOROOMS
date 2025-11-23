import { Card, CardContent } from '../ui/card';
import { fetchRoomSets } from '@/app/manage/room_sets/actions';
import { fetchRoomTypes } from '@/app/manage/room_types/actions';
import { filterRooms, getRoomByID } from '@/app/rooms/actions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { get_all_details } from '@/lib/get_all_details';
import { get24HourTime, getDateString } from '@/utils/time';
import Link from 'next/link';

export default async function Recommender({ userID }) {
  const roomSets = await fetchRoomSets();
  const roomTypes = await fetchRoomTypes();
  const details = await get_all_details(userID);
  console.log('frontend details:', details);

  const roomDetailsPromises = details.map(async detail => {
    const roomData = await getRoomByID(detail.room);
    return {
      ...detail, // Include the original data
      roomData, // Attach the result of getRoomByID
    };
  });

  const roomDetails = await Promise.all(roomDetailsPromises);

  console.log(roomDetails); // This will contain all the resolved room details

  return (
    <div className="flex items-center justify-center">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full max-w-6xl"
      >
        {roomDetails.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-lg font-semibold">
              No rooms to recommend, please try adjusting your personal schedule
              or wait for more reservations.
            </p>
          </div>
        ) : (
          <CarouselContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roomDetails.map((room, index) => (
              <CarouselItem key={index} className="min-w-40">
                <div className="p-1">
                  <Link
                    href={{
                      pathname: `/rooms/${room.roomData.room_id}`,
                      query: {
                        date: room.date,
                        startTime: room.startTime,
                        endTime: room.endTime,
                      },
                    }}
                    className="block"
                  >
                    <Card>
                      <CardContent className="flex flex-col items-start justify-center space-y-2 bg-cover bg-center p-6">
                        <div>
                          <h3 className="text-xl font-semibold drop-shadow-md">
                            {room.roomData.room_name}
                          </h3>
                          <p className="text-sm">Date: {room.date}</p>
                          <p className="text-sm">
                            Time: {room.startTime}:00 - {room.endTime}:00
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        )}

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
