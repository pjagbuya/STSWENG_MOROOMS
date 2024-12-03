import { getRoles } from '../../home/admin/users/actions';
import Header from '@/components/header';
import { RoleUpgradeForm } from '@/components/role-upgrade-form';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function EditProfilePage() {
  const roles = await getRoles();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: role } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });
  return (
    <div>
      <Header />
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Image
          src="/images/Login-bg.png"
          alt="DLSU classroom"
          layout="fill"
          className="absolute -z-10 opacity-50"
        />
        <RoleUpgradeForm roles={roles} currentRole={role} userId={user.id} />
      </div>
    </div>
  );
}
