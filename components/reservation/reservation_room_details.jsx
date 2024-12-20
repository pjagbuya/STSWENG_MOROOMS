'use client';

import Image from 'next/image';

export default function RoomDetails({ roomDetails }) {
  return (
    <div className="mb-6 flex max-h-28 items-center gap-8 overflow-hidden">
      <div className="flex-1">
        <h2 className="text-3xl font-bold">{roomDetails.room_name}</h2>
        <p className="text-gray-600">{roomDetails.room_set_name}</p>
        <p className="text-gray-600">
          Capacity: {roomDetails.room_type_capacity} pax
        </p>
      </div>

      <div className="flex-1 bg-red-100">
        <img
          className="overflow-none h-full w-full object-cover"
          src={roomDetails.room_image || '/test_image.png'}
          alt={`${roomDetails.room_name} Image`}
          width="600"
          height="250"
        />
      </div>
    </div>
  );
}
