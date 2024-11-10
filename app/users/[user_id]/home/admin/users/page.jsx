import { getRoles, getUsers } from './actions';
import { UserTable } from './user_table';
import React from 'react';

const Management = async () => {
  const users = await getUsers();
  const roles = await getRoles();
  console.log(users, roles);
  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <h1 className="text-3xl font-bold">Reservation Rooms</h1>
      <h3 className="text-base font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        laoreet, metus nec.
      </h3>
      <UserTable data={users} roles={roles} />
    </div>
  );
};

export default Management;
