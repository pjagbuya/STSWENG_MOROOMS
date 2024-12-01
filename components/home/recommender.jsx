import { RoomResult } from '../rooms/room_result';
import { fetchRoomSets } from '@/app/manage/room_sets/actions';
import { fetchRoomTypes } from '@/app/manage/room_types/actions';
import { filterRooms } from '@/app/rooms/actions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { get24HourTime, getDateString } from '@/utils/time';

export default async function Recommender() {
  const roomSets = await fetchRoomSets();
  const roomTypes = await fetchRoomTypes();

  // TODO: Change to proper function
  const rooms = (
    await filterRooms({
      date: getDateString(new Date()),
      startTime: get24HourTime(new Date()),
      endTime: '23:59',
    })
  ).flatMap(room => room.rooms);

  return (
    <div className="flex items-center justify-center">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full max-w-6xl"
      >
        <CarouselContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <CarouselItem key={index} className="min-w-40">
              <RoomResult
                isAdmin={false}
                room={room}
                roomSets={roomSets}
                roomTypes={roomTypes}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
