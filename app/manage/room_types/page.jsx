import { fetchRoomTypes } from './actions';
import { ProtectedContent } from '@/components/auth_components/authcomponents';
import Header from '@/components/header';
import AddRoomTypeButton from '@/components/manage/room_types/add_room_type_button';
import RoomTypeTable from '@/components/manage/room_types/room_type_table';
import { PERMISSIONS } from '@/lib/rbac-config';

export default async function ManageRoomTypesPage() {
  const roomTypesList = await fetchRoomTypes();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-6">
        <ProtectedContent
          permissions={[
            PERMISSIONS.ROOM_TYPE_CREATE,
            PERMISSIONS.ROOM_TYPE_UPDATE,
            PERMISSIONS.ROOM_TYPE_DELETE,
          ]}
          redirectTo="/unauthorized"
        >
          <h2 className="mb-4 text-3xl font-semibold">Manage Room Types</h2>

          <div className="mb-8 flex items-center gap-4">
            <AddRoomTypeButton />
          </div>

          <RoomTypeTable data={roomTypesList} />
        </ProtectedContent>
      </main>
    </>
  );
}
