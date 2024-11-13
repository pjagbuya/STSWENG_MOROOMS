import { columns } from './columns';
import UserDataTable from './table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/utils/supabase/server';
import { convertKeysToCamelCase } from '@/utils/utils';

export const userData = [
  {
    userFirstname: 'Alice',
    userLastname: 'Smith',
    userSchoolId: 'S12345',
    userRole: 'student',
  },
  {
    userFirstname: 'Bob',
    userLastname: 'Johnson',
    userSchoolId: 'S23456',
    userRole: 'teacher',
  },
  {
    userFirstname: 'Charlie',
    userLastname: 'Williams',
    userSchoolId: 'S34567',
    userRole: 'admin',
  },
  {
    userFirstname: 'Dana',
    userLastname: 'Brown',
    userSchoolId: 'S45678',
    userRole: 'student',
  },
  {
    userFirstname: 'Evan',
    userLastname: 'Taylor',
    userSchoolId: 'S56789',
    userRole: 'teacher',
  },
];

export default async function UserManagement() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    console.error(error.message);
  }

  const { data: roles, error: error2 } = await supabase.from('role').select();
  if (error2) {
    console.error(error2.message);
  }

  data.forEach(element => {
    element['roleList'] = roles;
  });

  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <h1 className="text-3xl font-bold">Reservation Rooms</h1>
      <h3 className="text-base font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        laoreet, metus nec.
      </h3>
      <Tabs defaultValue="user" className="h-full w-full">
        <TabsList>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="role_settings">Role Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserDataTable
            columns={columns}
            data={convertKeysToCamelCase(data)}
          />
        </TabsContent>
        <TabsContent value="role_settings">
          <UserDataTable
            columns={columns}
            data={convertKeysToCamelCase(data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
