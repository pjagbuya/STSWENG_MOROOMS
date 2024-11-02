import { roomColumns } from './columns';
import { DataTable } from '@/components/data-table';

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

export default async function DemoPage() {
  const data = await getRoomData();

  return (
    <div className="flex justify-between px-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Recommended Rooms</h1>
        <h3 className="text-base font-light">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          laoreet, metus nec.
        </h3>
        <DataTable columns={roomColumns} data={data} />
      </div>
    </div>
  );
}
