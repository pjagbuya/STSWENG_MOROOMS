'use client';

import {
  fetchReservationsWithRoomNames,
  updateReservationStatus,
} from '@/app/reservations/action';
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
import { parseTZDateRanges } from '@/utils/date_utils';
import React, { useEffect, useState } from 'react';

// Helper function to determine what color the certain status should be
const getStatusColor = status => {
  switch (status) {
    case 'Approved':
      return 'bg-green-200 text-green-800';
    case 'Canceled':
      return 'bg-red-200 text-red-800';
    case 'Pending':
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const StatusDropdown = ({ status, onStatusChange, isAdmin }) => {
  // unselectable
  if (!isAdmin) {
    return (
      <div
        className={`flex h-10 w-[180px] items-center justify-between rounded-md px-3 py-2 ${getStatusColor(status)}`}
      >
        {status}
      </div>
    );
  }

  // selectable
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[180px] ${getStatusColor(status)}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Canceled">Canceled</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default function ReservationTable({ userId, mode }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = mode === 'admin';

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      const data = await fetchReservationsWithRoomNames(userId);
      setReservations(data);
      setLoading(false);
    };

    if (userId) loadReservations();
  }, [userId]);

  const handleStatusChange = async (index, newStatus) => {
    try {
      // Update the status in the Supabase database
      const reservation = reservations[index];
      console.log('reservation to update: ', reservation);
      await updateReservationStatus(reservation.reservation_id, newStatus);

      // Update the state to reflect the new status
      setReservations(prevReservations =>
        prevReservations.map((reservation, i) =>
          i === index ? { ...reservation, status: newStatus } : reservation,
        ),
      );
    } catch (error) {
      console.error('Failed to update reservation status:', error);
      // Optionally, you can add some user feedback or error handling
    }
  };

  if (loading) return <div>Loading reservations...</div>;

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
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => {
            const ranges = reservation.reservationTime
              ? parseTZDateRanges(reservation.reservationTime)
              : [];

            return (
              <TableRow key={index}>
                <TableCell>
                  <StatusDropdown
                    status={reservation.status}
                    onStatusChange={newStatus =>
                      handleStatusChange(index, newStatus)
                    }
                    isAdmin={isAdmin}
                  />
                </TableCell>
                <TableCell>
                  {parseTZDateRanges(reservation.reservationTime).map(
                    ({ start, end }, i) => (
                      <div key={i} className="text-sm">
                        {new Date(start).toLocaleString()} -{' '}
                        {new Date(end).toLocaleString()}
                      </div>
                    ),
                  )}
                </TableCell>
                <TableCell>{reservation.roomName}</TableCell>
                <TableCell>{reservation.reservationCount}</TableCell>
                <TableCell>
                  {parseTZDateRanges(reservation.reservationTime).map(
                    ({ start, end }, i) => (
                      <div key={i} className="text-sm">
                        {new Date(start).toLocaleString()} -{' '}
                        {new Date(end).toLocaleString()}
                      </div>
                    ),
                  )}
                </TableCell>
                <TableCell className="max-w-[300px] whitespace-normal break-words">
                  {reservation.reservationPurpose}
                </TableCell>
                <TableCell>
                  {reservation.endorsementLetter ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500">
              <h2 className="p-6 text-3xl font-bold">No Reservations Made</h2>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
