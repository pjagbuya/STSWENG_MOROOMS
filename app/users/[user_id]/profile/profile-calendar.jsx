'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export default function ProfileCalender() {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="flex h-full w-[350px] rounded-md border-2 border-slate-200"
      classNames={{
        months:
          'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
        month: 'space-y-4 w-full flex flex-col',
        table: 'w-full h-full border-collapse space-y-1',
        head_row: '',
        row: 'w-full mt-2',
      }}
    />
  );
}
