import { reservationColumns, roomColumns } from './columns';
import Header from '@/components/header';
import RoomList from '@/components/room-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTable } from '@/components/util/data_table';

async function getRoomData() {
  return [
    {
      roomId: '728ed52f',
      roomType: 'Lab',
      roomDetails: 'Stinky room',
      roomOpports: 'Manual',
      roomName: 'SJA121',
      roomCapacity: 40,
    },
    {
      roomId: 'b3a1f89c',
      roomType: 'Lecture Hall',
      roomDetails: 'Audio-visual equipment available',
      roomOpports: 'Automated',
      roomName: 'Y508',
      roomCapacity: 100,
    },
    {
      roomId: 'f24bc9a2',
      roomType: 'Classroom',
      roomDetails: 'Equipped with projectors',
      roomOpports: 'Manual',
      roomName: 'LS102',
      roomCapacity: 35,
    },
    {
      roomId: 'c89de3b7',
      roomType: 'Lab',
      roomDetails: 'Computer lab with new PCs',
      roomOpports: 'Manual',
      roomName: 'G201',
      roomCapacity: 30,
    },
    {
      roomId: 'd19af2a9',
      roomType: 'Classroom',
      roomDetails: 'Air-conditioned, near library',
      roomOpports: 'Manual',
      roomName: 'LS210',
      roomCapacity: 45,
    },
    {
      roomId: 'e29bc5d3',
      roomType: 'Lecture Hall',
      roomDetails: 'Surround sound system',
      roomOpports: 'Automated',
      roomName: 'Y506',
      roomCapacity: 120,
    },
    {
      roomId: 'f90bc7e6',
      roomType: 'Lab',
      roomDetails: 'Chemistry lab with fume hoods',
      roomOpports: 'Manual',
      roomName: 'SJA114',
      roomCapacity: 25,
    },
    {
      roomId: 'a84ce1b5',
      roomType: 'Classroom',
      roomDetails: 'Standard classroom, whiteboard',
      roomOpports: 'Manual',
      roomName: 'M403',
      roomCapacity: 40,
    },
    {
      roomId: 'g12df5b8',
      roomType: 'Lecture Hall',
      roomDetails: 'Equipped with live streaming setup',
      roomOpports: 'Automated',
      roomName: 'N603',
      roomCapacity: 150,
    },
    {
      roomId: 'h53ac8f4',
      roomType: 'Lab',
      roomDetails: 'Robotics lab with 3D printers',
      roomOpports: 'Manual',
      roomName: 'G104',
      roomCapacity: 20,
    },
    {
      roomId: 'i29db7a1',
      roomType: 'Classroom',
      roomDetails: 'Spacious, for group activities',
      roomOpports: 'Manual',
      roomName: 'LS109',
      roomCapacity: 50,
    },
  ];
}

async function getReservationData() {
  return [
    {
      reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      reservationTime: ['[2024-11-01 09:00, 2024-11-01 11:00)'],
      reservationPurpose: 'Meeting',
      reservationType: 'Business',
      reservationIsSharing: false,
      reservationCount: 5,
    },
    {
      reservationId: 'b2c3d4e5-f6a7-8901-bcde-fa2345678901',
      reservationTime: ['[2024-11-02 14:00, 2024-11-02 16:00)'],
      reservationPurpose: 'Workshop',
      reservationType: 'Educational',
      reservationIsSharing: true,
      reservationCount: 20,
    },
    {
      reservationId: 'c3d4e5f6-a7b8-9012-cdef-ab3456789012',
      reservationTime: ['[2024-11-03 10:00, 2024-11-03 12:00)'],
      reservationPurpose: 'Conference',
      reservationType: 'Business',
      reservationIsSharing: false,
      reservationCount: 15,
    },
    {
      reservationId: 'd4e5f6a7-b8c9-0123-defa-bc4567890123',
      reservationTime: ['[2024-11-04 13:00, 2024-11-04 15:00)'],
      reservationPurpose: 'Training',
      reservationType: 'Educational',
      reservationIsSharing: true,
      reservationCount: 10,
    },
    {
      reservationId: 'e5f6a7b8-c9d0-1234-efab-cd5678901234',
      reservationTime: ['[2024-11-05 09:00, 2024-11-05 10:30)'],
      reservationPurpose: 'Project Discussion',
      reservationType: 'Business',
      reservationIsSharing: false,
      reservationCount: 8,
    },
    {
      reservationId: 'f6a7b8c9-d0e1-2345-fabc-de6789012345',
      reservationTime: ['[2024-11-06 15:00, 2024-11-06 17:00)'],
      reservationPurpose: 'Seminar',
      reservationType: 'Educational',
      reservationIsSharing: true,
      reservationCount: 25,
    },
    {
      reservationId: 'a7b8c9d0-e1f2-3456-abcd-ef7890123456',
      reservationTime: ['[2024-11-07 12:00, 2024-11-07 13:30)'],
      reservationPurpose: 'Client Meeting',
      reservationType: 'Business',
      reservationIsSharing: false,
      reservationCount: 3,
    },
    {
      reservationId: 'b8c9d0e1-f2a3-4567-bcde-fa8901234567',
      reservationTime: ['[2024-11-08 08:00, 2024-11-08 09:30)'],
      reservationPurpose: 'Team Sync',
      reservationType: 'Internal',
      reservationIsSharing: true,
      reservationCount: 12,
    },
    {
      reservationId: 'c9d0e1f2-a3b4-5678-cdef-ab9012345678',
      reservationTime: ['[2024-11-09 11:00, 2024-11-09 12:30)'],
      reservationPurpose: 'Lecture',
      reservationType: 'Educational',
      reservationIsSharing: true,
      reservationCount: 18,
    },
    {
      reservationId: 'd0e1f2a3-b4c5-6789-defa-bc0123456789',
      reservationTime: ['[2024-11-10 16:00, 2024-11-10 18:00)'],
      reservationPurpose: 'Networking Event',
      reservationType: 'Social',
      reservationIsSharing: false,
      reservationCount: 30,
    },
  ];
}

export default async function DemoPage() {
  const roomData = await getRoomData();
  const reservationData = await getReservationData();

  return (
    <div>
      <div className="flex h-screen justify-between gap-8 px-12">
        <div className="flex h-full w-full flex-col gap-2">
          <h1 className="text-3xl font-bold">Recommended Rooms</h1>
          <h3 className="text-base font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            laoreet, metus nec.
          </h3>
          <ScrollArea className="h-[80vh] w-full rounded-md border p-4">
            <RoomList roomsData={roomData} />
          </ScrollArea>
        </div>

        <div className="flex w-full flex-col gap-2">
          <h1 className="text-3xl font-bold">Reservation Rooms</h1>
          <h3 className="text-base font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            laoreet, metus nec.
          </h3>
          <DataTable columns={reservationColumns} data={reservationData} />
        </div>
      </div>
    </div>
  );
}
