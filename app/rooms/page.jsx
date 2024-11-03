import Header from '@/components/header';
import { SetResult } from '@/components/rooms/set_result';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';

export default function RoomSearchPage() {
  return (
    <>
      <Header />

      <main className="mb-1 px-8 py-4">
        <h2 className="mb-4 text-3xl font-semibold">Rooms</h2>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex max-w-lg flex-1 items-center rounded-lg border-2 border-slate-200 bg-white p-0.5 px-2 shadow-md">
            <Search className="mr-2 text-gray-500" />
            <Input
              className="w-full rounded-lg border-none focus:ring-0"
              placeholder="Search rooms..."
            />
          </div>

          <Button
            variant="secondary"
            className="rounded-full border-2 border-slate-200 bg-white px-2 py-3 shadow-md"
            asChild
          >
            <Search className="h-[3.25rem] w-[3.25rem]" />
          </Button>

          <Button className="flex gap-2 rounded-lg shadow-sm">
            <SlidersHorizontal />
            <span>Filter</span>
          </Button>
        </div>

        <div className="space-y-8">
          <SetResult
            set={{ name: 'Velasco' }}
            rooms={[
              {
                name: 'Velasco 501',
                location: 'Velasco Bldg.',
                capacity: 40,
                status: 'Available',
                image: '/test_image.png',
              },
              {
                name: 'Velasco 502',
                location: 'Velasco Bldg.',
                capacity: 40,
                status: 'Waiting List',
                image: '/test_image.png',
              },
            ]}
          />

          <SetResult
            set={{ name: 'Andrew' }}
            rooms={[
              {
                name: 'Andrew 201',
                location: 'Andrew Bldg.',
                capacity: 30,
                status: 'Unavailable',
                image: '/test_image.png',
              },
            ]}
          />
        </div>
      </main>
    </>
  );
}
