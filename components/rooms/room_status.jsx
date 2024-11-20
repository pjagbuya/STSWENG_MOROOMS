export function RoomStatus({ status }) {
  return (
    <span
      className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${status ? 'bg-[#72c169]' : 'bg-[#c23b4d]'}`}
    >
      {status ? 'Available' : 'Full'}
    </span>
  );
}
