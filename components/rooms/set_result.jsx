import { RoomResult } from './room_result';

export function SetResult({ set, rooms }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{set.name}</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <RoomResult room={room} key={index} />
        ))}
      </div>
    </div>
  );
}
