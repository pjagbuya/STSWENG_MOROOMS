'use client';

import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';

const noSelectClass = 'select-none user-select-none -webkit-user-select-none';

export default function HourSelector({
  selectedDay = new Date(),
  minHour,
  maxHour,
  onSelectionChange = () => {},
  initialSelectedHours = [],
  initialHourStates = [],
  mode,
}) {
  const [hourStates, setHourStates] = useState(initialHourStates);
  const [selectedHours, setSelectedHours] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const isRoomSchedule = mode === 'room_schedule';

  let dayOfTheWeek;
  let fullDate;

  if (isRoomSchedule) {
    // sets a day display for room schedules
    const dayStrings = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const dayNumber =
      typeof selectedDay === 'number'
        ? selectedDay
        : new Date(selectedDay).getDay(); // Ensure compatibility
    dayOfTheWeek = dayStrings[dayNumber % 7] || 'Invalid Day'; // Prevent out-of-bound errors
  } else {
    // sets a date display for reservations
    dayOfTheWeek = selectedDay.toLocaleDateString('en-US', {
      weekday: 'short',
    });
    fullDate = selectedDay.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // for handling hours selected by the user clicking and dragging
  const toggleHourSelection = hour => {
    if (!isRoomSchedule && hourStates[hour] === 'approved') return;

    setSelectedHours(prev => {
      if (prev.includes(hour)) {
        return prev.filter(h => h !== hour);
      } else {
        return [...prev, hour];
      }
    });
  };

  const handleMouseDown = hour => {
    if (!isRoomSchedule && hourStates[hour] === 'approved') return;

    setIsDragging(true);
    setDragStart(hour);
    setIsSelecting(!selectedHours.includes(hour));
    toggleHourSelection(hour);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    console.log(
      'Selected hours:',
      selectedHours.sort((a, b) => a - b),
    );
    onSelectionChange(selectedHours);
  };

  const handleMouseEnter = hour => {
    if (isDragging && dragStart !== null) {
      const start = Math.min(dragStart, hour);
      const end = Math.max(dragStart, hour);
      const affectedHours = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i,
      );

      setSelectedHours(prev => {
        let newSelection = [...prev];
        affectedHours.forEach(h => {
          // only allows for hours that arent labelled as "unavailable" to be selected
          if (isRoomSchedule || hourStates[h] !== 'unavailable') {
            if (isSelecting && !newSelection.includes(h)) {
              newSelection.push(h);
            } else if (!isSelecting && newSelection.includes(h)) {
              newSelection = newSelection.filter(selected => selected !== h);
            }
          }
        });
        return newSelection;
      });
    }
  };

  // for handling hours selected by autofill
  useEffect(() => {
    // Initialize selectedHours with initialSelectedHours when the component mounts
    if (initialSelectedHours !== null) {
      if (initialSelectedHours.length != 0) {
        setSelectedHours(initialSelectedHours);
      }
    }
  }, [initialSelectedHours]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, selectedHours]);

  // Function for determining what color the certain hour should be
  const getHourStyle = hour => {
    const isSelected = selectedHours.includes(hour);
    const state = hourStates[hour] || 'available'; // assumes available unless stated

    if (isRoomSchedule) {
      if (state === 'approved') {
        return isSelected ? 'bg-green-500' : 'bg-red-200';
      } else {
        return isSelected ? 'bg-red-500' : 'bg-green-200';
      }
    }

    switch (state) {
      case 'available':
        return isSelected ? 'bg-green-500' : 'bg-green-200';
      case 'pending':
        return isSelected ? 'bg-yellow-500' : 'bg-yellow-200';
      case 'approved': // BECAUSE if a reservation is labelled "approved" it is unavailable
        return isSelected && isRoomSchedule
          ? 'bg-red-500'
          : 'bg-red-500 cursor-not-allowed';
      default:
        return 'bg-slate-700';
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 text-muted-foreground shadow ${noSelectClass}`}
    >
      <div className="mb-4">
        {isRoomSchedule ? (
          <p className="text-center">{dayOfTheWeek} Schedule</p>
        ) : (
          <div className="flex justify-between">
            <p>GMT+08</p>
            <p>
              {dayOfTheWeek} | <span>{fullDate}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        {Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
          const hour = minHour + i;
          const period = hour >= 12 ? 'PM' : 'AM';
          let displayHour;
          if (hour === 0 || hour === 24) {
            displayHour = 12;
          } else if (hour > 12) {
            displayHour = hour - 12;
          } else {
            displayHour = hour;
          }

          const borderStyle =
            hour !== maxHour ? 'border-b border-gray-200' : '';
          const hourStyle = getHourStyle(hour);

          return (
            <div
              key={hour}
              className="grid grid-cols-[1fr_2fr] items-center"
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
            >
              <p className="text-[0.8rem]">{`${displayHour} ${period}`}</p>
              <span
                className={`p-3.5 ${borderStyle} ${hourStyle} cursor-pointer transition-colors duration-150 ${noSelectClass}`}
                role="checkbox"
                aria-checked={selectedHours.includes(hour)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleHourSelection(hour);
                    onSelectionChange(selectedHours);
                  }
                }}
              ></span>
            </div>
          );
        })}
      </div>
      <div>
        <Separator className="my-4" />
        <i>Click and Drag to select a time</i> <br />
        <i>
          Each interval selected is the labelled hour until :59 of that hour
        </i>
      </div>
    </div>
  );
}
