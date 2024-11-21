import { get_room_details } from '@/app/rooms/[roomId]/action';
import Header from '@/components/header';
import RoomReservationForm from '@/components/reservation/reservation-form';
import RoomDetails from '@/components/reservation/reservation_room_details';
import Image from 'next/image';

export default async function RoomReservationPage({ params }) {
  const { roomId } = params;
  const roomDetails = await get_room_details(roomId);
  console.log('roomDetails:', roomDetails);
  return (
    <>
      <Header />

      <main className="px-8 py-4">
        {/* Room Details */}
        <RoomDetails roomDetails={roomDetails} />
        <RoomReservationForm
          roomId={roomId}
          userID={'bb794c03-711a-41dd-be9a-9b80b3d068fd'}
        />
        {/* TODO: CHANGE USERID HOWEVER ITS GOTTEN */}
      </main>
    </>
  );
}
