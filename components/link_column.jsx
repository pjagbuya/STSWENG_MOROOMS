import { File } from 'lucide-react';
import Link from 'next/link';

export function addLinkColumn(columns, columnUrlName, columnName) {
  return [
    ...columns,
    {
      accessorKey: 'proof',
      id: 'proof',
      header: 'Proof',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link
            className="flex items-center gap-2"
            target="_blank"
            href={row.original[columnUrlName]}
          >
            <File size={16} />
            {row.original[columnName]}
          </Link>
        );
      },
    },
  ];
}
