import { fetchRoomSets } from './actions';
import Header from '@/components/header';
import AddRoomSetButton from '@/components/manage/room_sets/add_room_set_button';
import RoomSetTable from '@/components/manage/room_sets/room_set_table';

export default async function ManageRoomSetsPage() {
  const roomSetsList = await fetchRoomSets();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-4">
        <h2 className="mb-4 text-3xl font-semibold">Manage Room Sets</h2>
        <div className="mb-8 flex items-center gap-4">
          <AddRoomSetButton />
        </div>

        <RoomSetTable data={roomSetsList} />
      </main>
    </>
  );
}
