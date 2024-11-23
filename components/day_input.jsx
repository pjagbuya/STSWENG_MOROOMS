'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';

const days = [
  { name: 'Monday', value: 0 },
  { name: 'Tuesday', value: 1 },
  { name: 'Wednesday', value: 2 },
  { name: 'Thursday', value: 3 },
  { name: 'Friday', value: 4 },
  { name: 'Saturday', value: 5 },
  { name: 'Sunday', value: 6 },
];

export default function DaySelector({ onDaySelect }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDaySelect = value => {
    const day = parseInt(value, 10);
    setSelectedDay(day);
    onDaySelect(day);
  };

  return (
    <div className="w-[280px]">
      <Select onValueChange={handleDaySelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a day" />
        </SelectTrigger>
        <SelectContent>
          {days.map(day => (
            <SelectItem key={day.value} value={day.value.toString()}>
              {day.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
