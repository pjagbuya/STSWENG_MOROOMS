'use client';

import { userColumns } from './columns';
import { DataTable } from '@/components/data-table';

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

export default function UserManagement() {
  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <h1 className="text-3xl font-bold">Reservation Rooms</h1>
      <h3 className="text-base font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        laoreet, metus nec.
      </h3>
      <DataTable columns={userColumns} data={userData} />
    </div>
  );
}
