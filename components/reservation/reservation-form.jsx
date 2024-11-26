'use client';

import FileInput from '../util/file_input';
import {
  get_labelled_room_hours,
  get_min_max_room_hours,
  reserve,
} from '@/app/rooms/[roomId]/action';
import HourSelector from '@/components/reservation/hour_selector';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// function logFormData(formData) {
//   console.log('FormData contents:');
//   for (let [key, value] of formData.entries()) {
//     if (value instanceof File) {
//       console.log(key, ':', value.name, '(File)');
//     } else {
//       console.log(key, ':', value);
//     }
//   }
// }

export default function RoomReservationForm({ roomId, userID }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState(null);
  const [errors, setErrors] = useState({});
  const [hourStates, setHourStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHourStates() {
      setIsLoading(true);
      try {
        const data = await get_labelled_room_hours(
          roomId,
          selectedDate || new Date(),
        );
        setHourStates(data);
      } catch (error) {
        console.error('Error fetching hour states:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHourStates();
  }, [roomId, selectedDate]);

  const [minHour, setMinHour] = useState(0);
  const [maxHour, setMaxHour] = useState(0);

  useEffect(() => {
    async function fetchHours() {
      const time = await get_min_max_room_hours(roomId);
      setMinHour(time.start);
      setMaxHour(time.end);
    }
    fetchHours();
  }, [roomId]);

  // Function for form validation
  const validateForm = formData => {
    const newErrors = {};

    if (!selectedDate) newErrors.selectedDate = 'Please select a date.';
    if (!selectedHours || selectedHours.length === 0)
      newErrors.selectedHours = 'Please select at least one hour.';
    if (!formData.get('purpose')) {
      newErrors.purpose = 'Please enter a purpose for the reservation.';
    } else if (formData.get('purpose').length > 100) {
      newErrors.purpose = 'Should not exceed 100 characters';
    }
    if (!formData.get('count') || formData.get('count') === '0')
      newErrors.count = 'Please enter number of participants.';
    if (!formData.get('reservation_name'))
      newErrors.reservation_name = 'Please enter a reservation name.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('user_id', userID);
    formData.append('room_id', roomId);
    formData.append(
      'selectedDate',
      selectedDate ? selectedDate.toISOString() : '',
    );
    formData.append('selectedHours', JSON.stringify(selectedHours));

    if (validateForm(formData)) {
      try {
        await reserve(formData);
        toast({
          description: `Reservation for ${formData.get('reservation_name')} submitted successfully!`,
        });
        //router.push('/rooms'); // Redirect to the /rooms page
      } catch (error) {
        console.error('Error submitting reservation:', error);
        toast({
          description: 'Failed to submit reservation. Please try again.',
          variant: 'error',
        });
        //router.push('/error');
      }
    } else {
      console.log('Errors: ', errors);
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
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="flex justify-center rounded-md border"
              />
              {errors.selectedDate && (
                <p className="text-red-500">{errors.selectedDate}</p>
              )}
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
              {errors.selectedHours && (
                <p className="text-red-500">{errors.selectedHours}</p>
              )}
            </div>

            {isLoading ? (
              <div>Loading hour availability...</div>
            ) : (
              <div>
                <Label>Select Hours</Label>
                <HourSelector
                  selectedDay={selectedDate || new Date()}
                  onSelectionChange={setSelectedHours}
                  initialHourStates={hourStates}
                  minHour={minHour}
                  maxHour={maxHour}
                  mode={'reserve'}
                />
                {errors.selectedHours && (
                  <p className="text-red-500">{errors.selectedHours}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 space-y-4 rounded-lg border px-4 py-5 shadow">
            <div>
              <Label className="mb-1 block font-medium">Reservation Name</Label>
              <Input
                type="text"
                name="reservation_name"
                placeholder="Event Expo Party 2024"
                className="w-full rounded-md border p-2"
              />
              {errors.reservation_name && (
                <p className="text-red-500">{errors.reservation_name}</p>
              )}
            </div>
            <div>
              <Label className="mb-1 block font-medium">
                Reservation Purpose
              </Label>
              <Textarea
                name="purpose"
                placeholder="Tell us why you want to reserve this room"
                className="min-h-48 w-full rounded-md border p-2"
              />
              {errors.purpose && (
                <p className="text-red-500">{errors.purpose}</p>
              )}
            </div>
            <div>
              <Label>Reservation Count</Label>
              <Input name="count" className="w-1/2" type="number" />
              {errors.count && <p className="text-red-500">{errors.count}</p>}
            </div>
            <div>
              <Label className="mb-1 block font-medium">
                Endorsement Letter (Optional)
              </Label>
              <FileInput
                name="endorsementLetter"
                placeholder={'Upload Endorsement Letter'}
                accept="application/pdf,image/*"
                className="w-full rounded-md border p-2"
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
