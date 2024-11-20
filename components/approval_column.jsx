import { Button } from './ui/button';

export function addApprovalButton(columns, OnApprove, OnDecline) {
  return [
    ...columns,
    {
      accessorKey: 'approval',
      id: 'approval',
      header: 'Approval',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <Button onClick={() => OnApprove(row)}>Approve</Button>
            <Button variant="outline" onClick={() => OnDecline(row)}>
              Decline
            </Button>
          </div>
        );
      },
    },
  ];
}
