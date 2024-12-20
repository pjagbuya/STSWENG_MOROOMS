'use client';

import { updateUserApprovalType } from './actions';
import { columns } from './columns';
import { addLinkColumn } from '@/components/link_column';
import { UserRoleChangePopup } from '@/components/user_role_change_popup';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function setPopup(row, setRowData, setOpenPopup) {
  setRowData(row);
  setOpenPopup(true);
}

export function VerifyUserTable({ data, approveTypes }) {
  const [rowData, setRowData] = useState(null);
  const [openUserApprovalPopup, setOpenUserApprovalPopup] = useState(false);
  const url = '/users/[user_id]/home/admin/users';

  let finalColumns = addCombobox(
    addLinkColumn(columns, 'proofURL', 'proof'),
    approveTypes,
    (index, approveTypeIndex) => {
      setRowData({ index, approveTypeIndex });
      setOpenUserApprovalPopup(true);
    },
    'isApproved',
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <UserRoleChangePopup
        open={openUserApprovalPopup}
        onCancel={() => {
          setRowData(null);
          setOpenUserApprovalPopup(false);
        }}
        onAction={() => {
          const action = async () => {
            await updateUserApprovalType(
              data[rowData.index].userId,
              approveTypes[rowData.approveTypeIndex].value,
              url,
            );
            setRowData(null);
            setOpenUserApprovalPopup(false);
          };

          action();
        }}
      />
    </div>
  );
}
