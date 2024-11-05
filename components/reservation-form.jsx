'use client';

import { reserve } from '@/app/rooms/[roomId]/action';
import HourSelector from '@/components/rooms/hour_selector';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function RoomReservationForm() {
  const [formData, setFormData] = useState({
    selectedDate: null,
    selectedHours: null,
  });

  const handleDateSelect = date => {
    setFormData(prevData => ({
      ...prevData,
      selectedDate: date,
    }));
  };

  const handleHourSelectionChange = hours => {
    setFormData(prevData => ({
      ...prevData,
      selectedHours: hours,
    }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    await reserve(formData);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-2 items-stretch justify-center gap-8">
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                onDateSelect={handleDateSelect}
                className="flex justify-center rounded-md border"
              />
              <div className="rounded-lg border p-4 shadow">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Status
                </h3>
                <ul className="flex flex-wrap gap-2">
                  <li className="flex items-center space-x-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-400"></span>
                    <span className="text-gray-600">Available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="text-gray-600">Unavailable</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
                    <span className="text-gray-600">Waiting List</span>
                  </li>
                </ul>
              </div>
            </div>

            <HourSelector
              selectedDay={new Date()}
              onSelectionChange={handleHourSelectionChange}
            />
          </div>

          <div className="flex flex-col justify-center gap-4 space-y-4 rounded-lg border px-4 py-5 shadow">
            <div>
              <Label className="mb-1 block font-medium">
                Reason for Reservation
              </Label>
              <Textarea
                placeholder="Tell us why you want to reserve this room"
                className="min-h-48 w-full rounded-md border p-2"
              />
            </div>

            <div>
              <Label className="mb-1 block font-medium">
                Endorsement Letter (Optional)
              </Label>
              <Input type="file" className="w-full rounded-md border p-2" />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="rounded-md px-4 py-2">
                Reset
              </Button>
              <div className="space-x-2">
                <Button type="submit" className="rounded-md px-4 py-2">
                  Confirm Reservation
                </Button>
                <Button variant="outline" className="rounded-md px-4 py-2">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
