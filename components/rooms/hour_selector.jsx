'use client';

import React, { useEffect, useState } from 'react';

const noSelectClass = 'select-none user-select-none -webkit-user-select-none';

export default function HourSelector({
  selectedDay = new Date(),
  minHour = 7,
  maxHour = 19,
  onSelectionChange = () => {},
}) {
  const [selectedHours, setSelectedHours] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isSelecting, setIsSelecting] = useState(true);

  const dayOfTheWeek = selectedDay.toLocaleDateString('en-US', {
    weekday: 'short',
  });
  const fullDate = selectedDay.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleHourSelection = hour => {
    setSelectedHours(prev => {
      if (prev.includes(hour)) {
        return prev.filter(h => h !== hour);
      } else {
        return [...prev, hour];
      }
    });
  };

  const handleMouseDown = hour => {
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
          if (isSelecting && !newSelection.includes(h)) {
            newSelection.push(h);
          } else if (!isSelecting && newSelection.includes(h)) {
            newSelection = newSelection.filter(selected => selected !== h);
          }
        });
        return newSelection;
      });
    }
  };

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

  return (
    <div
      className={`rounded-lg border p-4 text-muted-foreground shadow ${noSelectClass}`}
    >
      <div className="mb-4 flex justify-between">
        <p>GMT+08</p>
        <p>
          {dayOfTheWeek} | <span>{fullDate}</span>
        </p>
      </div>

      <div>
        {Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
          const hour = minHour + i;
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour;

          const borderStyle =
            hour !== maxHour ? 'border-b border-gray-200' : '';
          const isSelected = selectedHours.includes(hour);
          const selectedStyle = isSelected ? 'bg-green-500' : 'bg-slate-700';

          return (
            <div
              key={hour}
              className="grid grid-cols-[1fr_2fr] items-center"
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
            >
              <p className="text-[0.8rem]">{`${displayHour} ${period}`}</p>
              <span
                className={`p-3.5 ${borderStyle} ${selectedStyle} cursor-pointer transition-colors duration-150 ${noSelectClass}`}
                role="checkbox"
                aria-checked={isSelected}
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
    </div>
  );
}
