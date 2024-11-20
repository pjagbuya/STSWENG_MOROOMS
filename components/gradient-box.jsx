import React from 'react';

export default function GradientBox({ gradient, title, body }) {
  return (
    <div
      className="flex h-full w-[320px] flex-col items-center justify-center rounded-md px-8"
      style={{ backgroundImage: gradient }}
    >
      <div className="flex flex-col gap-1">
        <div className="mb-2 h-5 w-5 rounded-full bg-white"></div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <h3 className="w-[128px] text-[16px] leading-none text-[#E2E8F0]">
          {body}
        </h3>
      </div>
    </div>
  );
}
