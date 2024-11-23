'use client';

import DaySelector from './room_schedule_day_input';
import { get_min_max_room_hours } from '@/app/room_schedule/action';
import {
  fetchRoomSchedule,
  updateRoomSchedule,
} from '@/app/room_schedule/action';
import HourSelector from '@/components/reservation/hour_selector';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { convertRangeToNumbers, parseTZDateRanges } from '@/utils/date_utils';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function logFormData(formData) {
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(key, ':', value.name, '(File)');
    } else {
      console.log(key, ':', value);
    }
  }
}

export default function RoomReservationForm({ roomId, userID }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedDay, setSelectedDay] = useState(0); // initally loaded to monday
  const [hourStates, setHourStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  const [minHour, setMinHour] = useState(0);
  const [maxHour, setMaxHour] = useState(0);

  useEffect(() => {
    async function fetchHours() {
      const time = await get_min_max_room_hours(roomId);
      setMinHour(time.start);
      setMaxHour(time.end);
      setIsLoading(false);
    }
    fetchHours();
  }, [roomId]);

  useEffect(() => {
    async function updateHourStates() {
      try {
        setIsLoading(true);
        setHourStates({}); // reset hour states if any during new fetch

        // Fetch the unavailable time ranges for the selected room and day
        const tzMultirange = await fetchRoomSchedule(roomId, selectedDay);
        // Parse the raw TZ multirange data into start and end times
        const unavailableRanges = parseTZDateRanges(tzMultirange);
        // Convert each range to numbers representing hours
        const hourRanges = unavailableRanges.map(convertRangeToNumbers);

        // Initialize `hourStates` with 'available' for all hours
        const newHourStates = {};
        for (let hour = minHour; hour <= maxHour; hour++) {
          newHourStates[hour] = 'available'; // Default state
        }

        // Update `hourStates` to 'approved' (due to how hour_selector logic works) for hours in the unavailable ranges
        hourRanges.forEach(range => {
          for (
            let hour = parseInt(range.start, 10);
            hour < parseInt(range.end, 10);
            hour++
          ) {
            newHourStates[hour] = 'approved';
          }
        });
        setHourStates(newHourStates);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch or process hour states:', error);
      }
    }

    // Trigger update only if a day is selected and min/max hours are defined
    if (selectedDay !== null && minHour !== 0 && maxHour !== 0) {
      updateHourStates();
    }
  }, [roomId, selectedDay, minHour, maxHour]);

  const handleDaySelect = day => {
    setSelectedDay(day); // Update the selected day state
    console.log('Selected day:', day);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('user_id', userID);
    formData.append('room_id', roomId);
    formData.append('selectedDay', selectedDay);
    formData.append('selectedHours', JSON.stringify(selectedHours));

    logFormData(formData);
    try {
      await updateRoomSchedule(formData);
      toast({
        description: `Reservation for ${formData.get('reservation_name')} submitted successfully!`,
      });
      //router.push('/rooms'); // Redirect to the /rooms page
    } catch (error) {
      console.error('Error submitting roomSchedule:', error);
      toast({
        description: 'Failed to submit roomSchedule. Please try again.',
        variant: 'error',
      });
      //router.push('/error');
    }
  };

  // Reset input fields
  const handleReset = () => {
    setSelectedDate(null);
    setSelectedHours(null);
    setErrors({});
    // Reset form fields
    document.getElementById('reservationForm').reset();
  };

  return (
    <>
      <form id="reservationForm" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-2 items-stretch justify-center gap-8">
            <div className="flex flex-col gap-4">
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
                </ul>
              </div>
              <DaySelector onDaySelect={handleDaySelect} />
            </div>
            <div>
              <Label>Select Hours to toggle availability</Label>
              {minHour !== 0 &&
              maxHour !== 0 &&
              hourStates &&
              Object.keys(hourStates).length > 0 ? (
                <HourSelector
                  selectedDay={selectedDay}
                  onSelectionChange={setSelectedHours}
                  initialHourStates={hourStates}
                  minHour={minHour}
                  maxHour={maxHour}
                  mode={'room_schedule'}
                />
              ) : (
                <p>Loading hours...</p> // Placeholder while data is being fetched
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 space-y-4 rounded-lg border px-4 py-5 shadow">
            <div>
              <Label className="mb-1 block font-medium">
                Room Schedule Name
              </Label>
              <Input
                type="text"
                name="reservation_name"
                placeholder="Ongoing STSWENG Class"
                className="w-full rounded-md border p-2"
              />
            </div>
            <div>
              <Label className="mb-1 block font-medium">
                Room Schedule Purpose
              </Label>
              <Textarea
                name="purpose"
                placeholder="What is happening at this time?"
                className="min-h-48 w-full rounded-md border p-2"
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-md px-4 py-2"
              >
                Reset
              </Button>
              <div className="space-x-2">
                <Button type="submit" className="rounded-md px-4 py-2">
                  Confirm Reservation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md px-4 py-2"
                >
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
