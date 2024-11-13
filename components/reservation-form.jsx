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
  // TEST DATA FOR HOUR STATES
  const hourStates = {
    8: 'unavailable',
    9: 'unavailable',
    10: 'unavailable',
    13: 'pending',
    14: 'pending',
    17: 'pending',
    18: 'pending',
    19: 'pending',
  };
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    selectedDate: null,
    selectedHours: null,
    purpose: '',
    count: 0,
    user_id: null, // TODO: add userID however its gotten
    reservation_name: '',
    room_id: null, // TODO: add roomID however its gotten
    letter: null,
  });

  const handleFormChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    setErrors(prevErrors => ({ ...prevErrors, [field]: '' })); // Clear field error on change
  };

  // Function for form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedDate)
      newErrors.selectedDate = 'Please select a date.';
    if (!formData.selectedHours || formData.selectedHours.length === 0)
      newErrors.selectedHours = 'Please select at least one hour.';
    if (!formData.purpose)
      newErrors.purpose = 'Please enter a purpose for the reservation.';
    //if (!formData.user_id) newErrors.user_id = 'User ID is required.';
    //if (!formData.reservation_name) newErrors.reservation_name = 'Please enter a reservation name.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Sending data...');
      await reserve(formData);
    } else {
      console.log('Errors: ', errors);
    }
  };

  const handleReset = () => {
    setFormData({
      selectedDate: null,
      selectedHours: null,
      purpose: '',
      endorsementLetter: null,
    });
    setErrors({});
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-2 items-stretch justify-center gap-8">
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={formData.selectedDate}
                onSelect={date => handleFormChange('selectedDate', date)}
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
            </div>

            <HourSelector
              selectedDay={formData.selectedDate || new Date()}
              onSelectionChange={hours =>
                handleFormChange('selectedHours', hours)
              }
              initialHourStates={hourStates}
            />
            {errors.selectedHours && (
              <p className="text-red-500">{errors.selectedHours}</p>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 space-y-4 rounded-lg border px-4 py-5 shadow">
            <div>
              <Label className="mb-1 block font-medium">
                Reservation Purpose
              </Label>
              <Textarea
                value={formData.purpose}
                onChange={e => handleFormChange('purpose', e.target.value)}
                placeholder="Tell us why you want to reserve this room"
                className="min-h-48 w-full rounded-md border p-2"
              />
              {errors.purpose && (
                <p className="text-red-500">{errors.purpose}</p>
              )}
            </div>

            <div>
              <Label className="mb-1 block font-medium">
                Endorsement Letter (Optional)
              </Label>
              <Input
                type="file"
                className="w-full rounded-md border p-2"
                onChange={e =>
                  handleFormChange('endorsementLetter', e.target.files[0])
                }
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
