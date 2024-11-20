import Link from 'next/link';

export function addLink(columns, columnUrlName, columnName) {
  return [
    {
      accessorKey: 'proof',
      id: 'proof',
      header: 'Proof',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link href={row.original[columnUrlName]}>
            {row.original[columnName]}
          </Link>
        );
      },
    },
    ...columns,
  ];
}
