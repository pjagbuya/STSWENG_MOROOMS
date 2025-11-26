import { fetchRoomSets } from './actions';
import Header from '@/components/header';
import AddRoomSetButton from '@/components/manage/room_sets/add_room_set_button';
import RoomSetTable from '@/components/manage/room_sets/room_set_table';
import { PERMISSIONS, hasAnyPermission } from '@/lib/rbac-config';
import { logPageAccessFailure } from '@/lib/server-rbac';
import { getUserWithRoleServerSide } from '@/utils/utils';
import { redirect } from 'next/navigation';

export default async function ManageRoomSetsPage() {
  // Server-side permission check
  const userWithRole = await getUserWithRoleServerSide();

  const requiredPermissions = [
    PERMISSIONS.ROOM_SET_CREATE,
    PERMISSIONS.ROOM_SET_UPDATE,
    PERMISSIONS.ROOM_SET_DELETE,
  ];

  if (!userWithRole) {
    await logPageAccessFailure({
      pagePath: '/manage/room_sets',
      user: null,
      requiredPermissions,
      reason: 'UNAUTHENTICATED',
    });
    redirect('/login');
  }

  const hasAccess = hasAnyPermission(userWithRole, requiredPermissions);

  if (!hasAccess) {
    await logPageAccessFailure({
      pagePath: '/manage/room_sets',
      user: userWithRole,
      requiredPermissions,
      reason: 'PERMISSION_DENIED',
    });
    redirect('/unauthorized');
  }

  const roomSetsList = await fetchRoomSets();

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-6">
        <h2 className="mb-4 text-3xl font-semibold">Manage Room Sets</h2>
        <div className="mb-8 flex items-center gap-4">
          <AddRoomSetButton />
        </div>

        <RoomSetTable data={roomSetsList} />
      </main>
    </>
  );
}
