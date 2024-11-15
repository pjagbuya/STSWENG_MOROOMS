import { fetchRoomSets } from '@/app/manage/room_sets/actions';
import { fetchRoomTypes } from '@/app/manage/room_types/actions';
import { filterRooms } from '@/app/rooms/actions';
import Header from '@/components/header';
import AddRoomButton from '@/components/rooms/add_room_button';
import SearchBar from '@/components/rooms/search_bar';
import SearchFilter from '@/components/rooms/search_filter';
import { SetResult } from '@/components/rooms/set_result';
import { Button } from '@/components/ui/button';
import { get24HourTime, getDateString } from '@/utils/time';
import { isAdminServerSide } from '@/utils/utils';
import { Settings } from 'lucide-react';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function RoomSearchPage({ searchParams }) {
  const isAdmin = await isAdminServerSide();

  const searchFilters = {
    name: searchParams.name,
    date: searchParams.date ?? getDateString(new Date()),
    minCapacity: searchParams.minCapacity ?? 0,
    startTime: searchParams.startTime ?? get24HourTime(new Date()),
    endTime: searchParams.endTime ?? '23:59',
    roomSetId: searchParams.roomSetId,
  };

  const roomSets = await fetchRoomSets();
  const roomTypes = await fetchRoomTypes();

  const rooms = await filterRooms(searchFilters);

  async function handleSearch(filters) {
    'use server';

    const queryParamString = new URLSearchParams(filters).toString();
    redirect(`/rooms?${queryParamString}`);
  }

  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-4">
        <h2 className="mb-4 text-3xl font-semibold">Reserve a Room</h2>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex flex-1 items-center gap-4">
            <SearchBar onSearch={handleSearch} />
            <SearchFilter
              filters={searchFilters}
              roomSets={roomSets}
              onSearch={handleSearch}
            />
          </div>

          {isAdmin && (
            <div className="flex gap-4">
              <AddRoomButton />

              <Button asChild className="rounded-lg shadow-md">
                <Link href="/manage/room_types">
                  <Settings className="mr-0.5" />
                  Manage Room Types
                </Link>
              </Button>
              <Button asChild className="rounded-lg shadow-md">
                <Link href="/manage/room_sets">
                  <Layers className="mr-0.5" />
                  Manage Room Sets
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {rooms.length === 0 ? (
            <p className="text-center text-xl font-bold italic text-gray-700">
              No rooms available 😅.
            </p>
          ) : (
            rooms.map(({ set_id, set_name, rooms }) => (
              <SetResult
                key={set_id}
                isAdmin={isAdmin}
                setName={set_name}
                rooms={rooms.map(r => ({
                  ...r,
                  room_set_id: set_id,
                  location: set_name,
                }))}
                roomSets={roomSets}
                roomTypes={roomTypes}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
