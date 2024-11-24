import { get_room_details } from './action';
import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import PersonalScheduleForm from '@/components/personal_schedule_input';
import RoomDetails from '@/components/reservation/reservation_room_details';
import Image from 'next/image';

export default async function PersonalSchedulePage() {
  const userInfo = await getCurrentUserInfo();

  return (
    <>
      <Header />

      <main className="px-8 py-4">
        {/* Room Details */}
        <PersonalScheduleForm userID={userInfo.userId} />
      </main>
    </>
  );
}
