import Header from '@/components/header';
import RoomReservationForm from '@/components/reservation-form';
import Image from 'next/image';

export default function RoomReservationPage({ params }) {
  const { roomId } = params;
  return (
    <>
      <Header />

      <main className="px-8 py-4">
        {/* Room Details */}
        <div className="mb-6 flex max-h-28 items-center gap-8 overflow-hidden">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Velasco 501</h2>
            <p className="text-gray-600">Location: Velasco Building</p>
            <p className="text-gray-600">Capacity: 40 pax</p>
          </div>

          <div className="flex-1 bg-red-100">
            <Image
              className="overflow-none h-full w-full object-cover"
              src="/test_image.png"
              alt="Room Image"
              width={600}
              height={250}
            />
          </div>
        </div>
        <RoomReservationForm roomId={roomId} />
      </main>
    </>
  );
}
