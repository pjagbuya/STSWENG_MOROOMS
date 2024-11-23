import { get_room_details } from './action';
import Header from '@/components/header';
import RoomDetails from '@/components/reservation/reservation_room_details';
import RoomScheduleInput from '@/components/rooms/room_schedule_input';
import Image from 'next/image';

export default async function RoomReservationPage() {
  //const { roomId } = params;
  const roomId = '38da1d5b-bcd5-4772-a9c9-2855236319d6';
  const userID = 'bb794c03-711a-41dd-be9a-9b80b3d068fd';
  // TODO: CHANGE TO ACTUAL ROOM ID & USER ID
  const roomDetails = await get_room_details(roomId);
  return (
    <>
      <Header />

      <main className="px-8 py-4">
        {/* Room Details */}
        <RoomDetails roomDetails={roomDetails} />
        <RoomScheduleInput roomId={roomId} userID={userID} />
      </main>
    </>
  );
}
