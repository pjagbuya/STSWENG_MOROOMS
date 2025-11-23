'use client';

import {
  deleteReservation,
  fetchReservationsWithRoomNames,
  updateReservationStatus,
} from '@/app/manage/reservations/action';
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
import Link from 'next/link';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const isAdmin = mode === 'edit';

  const handleDeleteReservation = async reservationId => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const { error } = await deleteReservation(reservationId);

      if (error) {
        console.error('Error deleting reservation:', error);
        alert('Failed to delete reservation.');
      } else {
        // Remove the reservation from the state
        setReservations(prevReservations =>
          prevReservations.filter(
            reservation => reservation.reservation_id !== reservationId,
          ),
        );
        alert('Reservation deleted successfully.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      const data = await fetchReservationsWithRoomNames(userId, isAdmin);

      // Filter out reservations with dates that have already passed
      const filteredData = data.filter(reservation => {
        const ranges = reservation.reservationTime
          ? parseTZDateRanges(reservation.reservationTime)
          : [];
        // Check if any end date in the ranges is in the future
        return ranges.some(({ end }) => new Date(end) >= new Date());
      });

      setReservations(filteredData);
      setLoading(false);
    };

    if (userId) loadReservations();
  }, [userId]);

  const paginatedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  const handleStatusChange = async (index, newStatus) => {
    try {
      // Update the status in the Supabase database
      const reservation = reservations[index];
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
    <>
      <Table>
        <TableCaption>Recent Reservations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[200px]">
              Reservation Request Date
            </TableHead>
            <TableHead className="w-[200px]">Room Name</TableHead>
            <TableHead className="w-[150px]">Slots Reserved</TableHead>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead className="w-[300px]">Reason</TableHead>
            <TableHead className="w-[100px]">Endorsement Letter</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReservations.length > 0 ? (
            paginatedReservations.map((reservation, index) => {
              const originalIndex = reservations.indexOf(reservation);
              const ranges = reservation.reservationTime
                ? parseTZDateRanges(reservation.reservationTime)
                : [];

              return (
                <TableRow key={index}>
                  <TableCell>
                    <StatusDropdown
                      status={reservation.status}
                      onStatusChange={newStatus =>
                        handleStatusChange(originalIndex, newStatus)
                      }
                      isAdmin={isAdmin}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(
                      reservation.reservation_request_date,
                    ).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
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
                    {reservation.reservation_letter ? (
                      <a
                        href={reservation.reservation_letter}
                        className="text-blue-500 underline hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleDeleteReservation(reservation.reservation_id)
                      }
                      className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                <h2 className="p-6 text-3xl font-bold">No Reservations Made</h2>
                <Link href="/rooms">
                  <button className="mt-4 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
                    Make a new reservation
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`rounded border px-3 py-2 ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
