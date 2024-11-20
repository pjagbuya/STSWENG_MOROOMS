'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export function SortableHeader({ children, column }) {
  return (
    <Button
      className="p-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
