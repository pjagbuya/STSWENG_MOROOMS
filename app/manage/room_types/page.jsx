import { fetchRoomTypes } from './actions';
import Header from '@/components/header';
import AddRoomTypeButton from '@/components/manage/room_types/add_room_type_button';
import RoomTypeTable from '@/components/manage/room_types/room_type_table';
import { PERMISSIONS, hasAnyPermission } from '@/lib/rbac-config';
import { logPageAccessFailure } from '@/lib/server-rbac';
import { getUserWithRoleServerSide } from '@/utils/utils';
import { redirect } from 'next/navigation';

export default async function ManageRoomTypesPage() {
  // Server-side permission check
  const userWithRole = await getUserWithRoleServerSide();

  const requiredPermissions = [
    PERMISSIONS.ROOM_TYPE_CREATE,
    PERMISSIONS.ROOM_TYPE_UPDATE,
    PERMISSIONS.ROOM_TYPE_DELETE,
  ];

  if (!userWithRole) {
    await logPageAccessFailure({
      pagePath: '/manage/room_types',
      user: null,
      requiredPermissions,
      reason: 'UNAUTHENTICATED',
    });
    redirect('/login');
  }

  const hasAccess = hasAnyPermission(userWithRole, requiredPermissions);

  if (!hasAccess) {
    await logPageAccessFailure({
      pagePath: '/manage/room_types',
      user: userWithRole,
      requiredPermissions,
      reason: 'PERMISSION_DENIED',
    });
    redirect('/unauthorized');
  }

  const roomTypesList = await fetchRoomTypes();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-6">
        <h2 className="mb-4 text-3xl font-semibold">Manage Room Types</h2>

        <div className="mb-8 flex items-center gap-4">
          <AddRoomTypeButton />
        </div>

        <RoomTypeTable data={roomTypesList} />
      </main>
    </>
  );
}
