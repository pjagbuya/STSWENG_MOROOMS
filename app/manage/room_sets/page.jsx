import { fetchRoomSets } from './actions';
import { ProtectedContent } from '@/components/auth_components/authcomponents';
import Header from '@/components/header';
import AddRoomSetButton from '@/components/manage/room_sets/add_room_set_button';
import RoomSetTable from '@/components/manage/room_sets/room_set_table';
import { PERMISSIONS } from '@/lib/rbac-config';

export default async function ManageRoomSetsPage() {
  const roomSetsList = await fetchRoomSets();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-6">
        <ProtectedContent
          permissions={[
            PERMISSIONS.ROOM_SET_CREATE,
            PERMISSIONS.ROOM_SET_UPDATE,
            PERMISSIONS.ROOM_SET_DELETE,
          ]}
          redirectTo="/unauthorized"
        >
          <h2 className="mb-4 text-3xl font-semibold">Manage Room Sets</h2>
          <div className="mb-8 flex items-center gap-4">
            <AddRoomSetButton />
          </div>

          <RoomSetTable data={roomSetsList} />
        </ProtectedContent>
      </main>
    </>
  );
}
