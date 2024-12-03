import { get_room_details } from './action';
import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import RoomDetails from '@/components/reservation/reservation_room_details';
import RoomScheduleInput from '@/components/rooms/room_schedule_input';
import Image from 'next/image';

export default async function RoomSchedulePage({ params: { roomId } }) {
  const userInfo = await getCurrentUserInfo();
  const roomDetails = await get_room_details(roomId);

  return (
    <>
      <Header />

      <main className="px-8 py-4">
        {/* Room Details */}
        <RoomDetails roomDetails={roomDetails} />
        <RoomScheduleInput roomId={roomId} userID={userInfo.userId} />
      </main>
    </>
  );
}
