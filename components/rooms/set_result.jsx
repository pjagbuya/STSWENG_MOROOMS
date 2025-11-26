import { RoomResult } from './room_result';

export function SetResult({ isEditable, setName, rooms, roomSets, roomTypes }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{setName}</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <RoomResult
            isEditable={isEditable}
            room={room}
            key={index}
            roomSets={roomSets}
            roomTypes={roomTypes}
          />
        ))}
      </div>
    </div>
  );
}
