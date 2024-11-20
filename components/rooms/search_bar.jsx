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
    <form
      className="flex max-w-lg flex-1 items-center gap-2"
      action={() =>
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
      <div className="flex flex-1 items-center rounded-lg border-2 border-slate-200 bg-white p-0.5 px-2 shadow-md focus-within:outline">
        <Search className="mr-2 text-gray-500" />
        <Input
          className="w-full rounded-lg border-none focus-visible:ring-transparent"
          placeholder="Search rooms..."
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
      </div>

      <button
        variant="secondary"
        className="rounded-full border-2 border-slate-200 bg-white px-3 py-3 shadow-md"
        type="submit"
      >
        <Search className="h-[1.5rem] w-[1.5rem]" />
      </button>
    </form>
  );
}
