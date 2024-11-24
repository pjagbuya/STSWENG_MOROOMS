'use client';

import DaySelector from './day_input';
import {
  fetchPersonalSchedule,
  updatePersonalSchedule,
} from '@/app/personal_schedule/action';
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

export default function PersonalScheduleForm({ userID }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedDay, setSelectedDay] = useState(0); // initally loaded to monday
  const [hourStates, setHourStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  const [minHour, setMinHour] = useState(0);
  const [maxHour, setMaxHour] = useState(23);

  useEffect(() => {
    async function updateHourStates() {
      try {
        setIsLoading(true);
        setHourStates({}); // Reset hour states if any during new fetch

        // Fetch the unavailable time ranges for the selected room and day
        const tzMultirange = await fetchPersonalSchedule(userID, selectedDay);
        console.log('tzMultirange: ', tzMultirange);

        let newHourStates = {};
        if (!tzMultirange || tzMultirange.length === 0) {
          // If the fetched data is empty or null, mark all hours as 'available'
          for (let hour = minHour; hour <= maxHour; hour++) {
            newHourStates[hour] = 'available';
          }
        } else {
          // Parse the raw TZ multirange data into start and end times
          const unavailableRanges = parseTZDateRanges(tzMultirange);
          // Convert each range to numbers representing hours
          const hourRanges = unavailableRanges.map(convertRangeToNumbers);

          // Initialize `hourStates` with 'available' for all hours
          for (let hour = minHour; hour <= maxHour; hour++) {
            newHourStates[hour] = 'available'; // Default state
          }

          // Update `hourStates` to 'approved' for hours in the unavailable ranges
          hourRanges.forEach(range => {
            for (
              let hour = parseInt(range.start, 10);
              hour < parseInt(range.end, 10);
              hour++
            ) {
              newHourStates[hour] = 'approved';
            }
          });
        }

        setHourStates(newHourStates);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch or process hour states:', error);
        setIsLoading(false); // Ensure the loading state is reset even if there's an error
      }
    }

    // Trigger update only if a day is selected and min/max hours are defined
    if (selectedDay !== null && minHour !== null && maxHour !== null) {
      updateHourStates();
    }
  }, [userID, selectedDay, minHour, maxHour]);

  const handleDaySelect = day => {
    setSelectedDay(day); // Update the selected day state
    console.log('Selected day:', day);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('user_id', userID);
    formData.append('selectedDay', selectedDay);
    formData.append('selectedHours', JSON.stringify(selectedHours));

    logFormData(formData);
    try {
      await updatePersonalSchedule(formData);
      toast({
        description: `Personal Schedule for ${formData.get('user_id')} submitted successfully!`,
      });
      router.push('/'); // Redirect to the home page
    } catch (error) {
      console.error('Error submitting PersonalSchedule:', error);
      toast({
        description: 'Failed to submit PersonalSchedule. Please try again.',
        variant: 'error',
      });
      router.push('/error');
    }
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
              {minHour !== null &&
              maxHour !== null &&
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
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button type="submit" className="rounded-md px-4 py-2">
                  Update Personal Schedule
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
