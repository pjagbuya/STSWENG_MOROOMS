'use client';

import React, { useEffect, useState } from 'react';

export default function HourSelector({
  selectedDay,
  minHour = 7,
  maxHour = 19,
}) {
  const dayOfTheWeek = selectedDay.toLocaleDateString('en-US', {
    weekday: 'short',
  });
  const fullDate = selectedDay.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-lg border p-4 text-muted-foreground shadow">
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

          return (
            <div key={hour} className="grid grid-cols-[1fr_2fr] items-center">
              <p className="text-[0.8rem]">{`${displayHour} ${period}`}</p>
              <span className={`bg-slate-700 p-3.5 ${borderStyle}`}></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
