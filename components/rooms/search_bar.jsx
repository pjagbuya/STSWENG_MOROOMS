'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const searchParams = useSearchParams();

  const [nameFilter, setNameFilter] = useState('');

  return (
    <>
      <div className="flex max-w-lg flex-1 items-center rounded-lg border-2 border-slate-200 bg-white p-0.5 px-2 shadow-md">
        <Search className="mr-2 text-gray-500" />
        <Input
          className="w-full rounded-lg border-none focus:ring-0"
          placeholder="Search rooms..."
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
      </div>

      <Button
        variant="secondary"
        className="rounded-full border-2 border-slate-200 bg-white px-2 py-3 shadow-md"
        asChild
        onClick={() =>
          onSearch({
            name: nameFilter || undefined,
            date: searchParams.get('date') ?? undefined,
            minCapacity: searchParams.get('minCapacity') ?? undefined,
            startTime: searchParams.get('startTime') ?? undefined,
            endTime: searchParams.get('endTime') ?? undefined,
            roomSetId: searchParams.get('roomSetId') ?? undefined,
          })
        }
      >
        <Search className="h-[3.25rem] w-[3.25rem]" />
      </Button>
    </>
  );
}
