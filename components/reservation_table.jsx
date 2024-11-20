'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';

// Helper function to determine what color the certain status should be
const getStatusColor = status => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-200 text-green-800';
    case 'Cancelled':
      return 'bg-red-200 text-red-800';
    case 'Pending':
      return 'bg-yellow-200 text-yellow-800';
    case 'Waitlisted':
      return 'bg-orange-200 text-orange-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const StatusDropdown = ({ status, onStatusChange }) => {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[180px] ${getStatusColor(status)}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Accepted">Accepted</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Waitlisted">Waitlisted</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default function ReservationTable({ reservations }) {
  const [reservationState, setReservationState] = useState(reservations);

  const handleStatusChange = (index, newStatus) => {
    setReservationState(prevReservations =>
      prevReservations.map((reservation, i) =>
        i === index ? { ...reservation, status: newStatus } : reservation,
      ),
    );
  };

  return (
    <Table>
      <TableCaption>Recent Reservations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Status</TableHead>
          <TableHead className="w-[200px]">Reservation Request Date</TableHead>
          <TableHead className="w-[200px]">Room Name</TableHead>
          <TableHead className="w-[150px]">Reservation Capacity</TableHead>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead className="w-[300px]">Reason</TableHead>
          <TableHead className="w-[100px]">Endorsement Letter</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservationState.map((reservation, index) => (
          <TableRow key={index}>
            <TableCell>
              <StatusDropdown
                status={reservation.status}
                onStatusChange={newStatus =>
                  handleStatusChange(index, newStatus)
                }
              />
            </TableCell>
            <TableCell>
              {reservation.reservationTime.map((time, index) => (
                <div key={index} className="text-sm">
                  {time[0].toLocaleString()} - {time[1].toLocaleString()}
                </div>
              ))}
            </TableCell>
            <TableCell>{reservation.roomName}</TableCell>
            <TableCell>{reservation.reservationCount}</TableCell>
            <TableCell>
              {reservation.reservationTime.map((time, timeIndex) => (
                <div key={timeIndex} className="text-sm">
                  {new Date(time[0]).toLocaleString()} -{' '}
                  {new Date(time[1]).toLocaleString()}
                </div>
              ))}
            </TableCell>
            <TableCell>{reservation.reservationPurpose}</TableCell>
            <TableCell>
              {reservation.endorsementLetter ? 'Yes' : 'No'}
            </TableCell>{' '}
            {/*TODO: Prolly make it so that "yes" would link to the letter to be viewed*/}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
