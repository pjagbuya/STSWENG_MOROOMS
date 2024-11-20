'use client';

import { approveRoleRequest, declineRoleRequest } from './actions';
import { upgradeUserRequestColumns } from './columns';
import { addApprovalButton } from '@/components/approval_column';
import { DefaultColumnPopup } from '@/components/default_column_popup';
import { DataTable } from '@/components/util/data_table';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function setPopup(row, setRowData, setOpenPopup) {
  setRowData(row);
  setOpenPopup(true);
}

export function UpgradeRoleUserTable({ data }) {
  const [rowData, setRowData] = useState(null);
  const [openUserUpgradeApprovalPopup, setOpenUpgradeApprovalPopup] =
    useState(false);
  const [openUserUpgradeDeclinePopup, setOpenUpgradeDeclinePopup] =
    useState(false);
  const url = usePathname();

  let finalColumns = addApprovalButton(
    upgradeUserRequestColumns,
    row => {
      setRowData(row.original);
      setOpenUpgradeApprovalPopup(true);
    },
    row => {
      setRowData(row.original);
      setOpenUpgradeDeclinePopup(true);
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <DefaultColumnPopup
        open={openUserUpgradeApprovalPopup}
        onCancel={() => {
          setRowData(null);
          setOpenUpgradeApprovalPopup(false);
        }}
        onAction={() => {
          const action = async () => {
            await approveRoleRequest(rowData.roleRequestId, url);
            setRowData(null);
            setOpenUpgradeApprovalPopup(false);
          };

          action();
        }}
        title={'Approve Role Request'}
        body={'Are you sure you want to approve this role request?'}
      />
      <DefaultColumnPopup
        open={openUserUpgradeDeclinePopup}
        onCancel={() => {
          setRowData(null);
          setOpenUpgradeDeclinePopup(false);
        }}
        onAction={() => {
          const action = async () => {
            await declineRoleRequest(rowData.roleRequestId, url);
            setRowData(null);
            setOpenUpgradeDeclinePopup(false);
          };

          action();
        }}
        title={'Decline Role Request'}
        body={'Are you sure you want to decline this role request?'}
      />
    </div>
  );
}
