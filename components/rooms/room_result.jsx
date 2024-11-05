import DeleteRoomButton from './delete_room_button';
import EditRoomButton from './edit_room_button';
import { RoomStatus } from './room_status';
import Link from 'next/link';

export function RoomResult({ room }) {
  return (
    <div className="relative">
      <Link href="/rooms/test" className="block">
        <article
          className="relative h-52 overflow-hidden rounded-lg border bg-cover bg-center shadow-md transition hover:shadow-lg"
          style={{ backgroundImage: `url(${room.image})` }}
        >
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-800 to-transparent p-4 text-white">
            <h4 className="text-xl font-semibold drop-shadow-md">
              {room.name}
            </h4>
            <p className="text-sm">Location: {room.location}</p>
            <p className="text-sm">Capacity: {room.capacity} pax</p>

            <RoomStatus status={room.status} />
          </div>
        </article>
      </Link>

      <div className="absolute bottom-2 right-2 flex space-x-2">
        <EditRoomButton />
        <DeleteRoomButton />
      </div>
    </div>
  );
}
