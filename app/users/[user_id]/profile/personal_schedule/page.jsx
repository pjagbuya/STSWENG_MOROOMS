import { get_all_rooms, get_user_personal_schedules } from './action';
import { getCurrentUserInfo } from '@/app/users/[user_id]/profile/action';
import Header from '@/components/header';
import AddPersonalScheduleButton from '@/components/manage/personal_schedule/add_personal_schedule_button';
import PersonalScheduleTable from '@/components/manage/personal_schedule/personal_schedule_table';
import { isAdminServerSide } from '@/utils/utils';

export default async function ManagePersonalSchedulePage() {
  const userInfo = await getCurrentUserInfo();
  const userID = userInfo.userId;
  const isAdmin = await isAdminServerSide();
  const personal_schedule_list = await get_user_personal_schedules(userID);
  const rooms_list = await get_all_rooms();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-6">
        <h2 className="mb-4 text-3xl font-semibold">
          Manage Personal Schedule
        </h2>

        <div className="mb-8 flex items-center gap-4">
          <AddPersonalScheduleButton rooms={rooms_list} userID={userID} />
        </div>

        <PersonalScheduleTable
          data={personal_schedule_list}
          rooms={rooms_list}
        />
      </main>
    </>
  );
}
