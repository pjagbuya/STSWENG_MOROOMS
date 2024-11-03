export function RoomStatus({ status }) {
  return (
    <span
      className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
    >
      {status}
    </span>
  );
}
