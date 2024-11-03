'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, SquareArrowOutUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

export function SortableHeader({ children, column }) {
  return (
    <Button
      className="p-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

/**
 * DataTable component renders a table with sorting, filtering, and row actions.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names for the table.
 * @param {boolean} [props.clickableIdColumn] - If true, the ID column will be clickable.
 * @param {Array} props.columns - The columns configuration for the table.
 * @param {Array} props.data - The data to be displayed in the table.
 * @param {boolean} [props.deletable] - If true, rows can be deleted.
 * @param {string} props.idColumn - The column ID to be used as the identifier.
 * @param {string} [props.idFilter] - The filter value for the ID column.
 * @param {string} props.pkColumn - The primary key column.
 * @param {Function} [props.onRowEdit] - Callback function when a row is edited.
 * @param {Function} [props.onRowDelete] - Callback function when a row is deleted.
 * @param {Function} [props.onRowSelect] - Callback function when a row is selected.
 *
 * @returns {JSX.Element} The rendered DataTable component.
 */
export function DataTable({
  className,
  clickableIdColumn,
  columns,
  data,
  deletable,
  idColumn,
  idFilter,
  pkColumn,
  onRowEdit,
  onRowDelete,
  onRowSelect,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    table.getColumn(idColumn)?.setFilterValue(idFilter ?? '');
  }, [table, idColumn, idFilter]);

  return (
    <div className="flex flex-col">
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}

              {/* Extra to accommodate edit button */}
              <TableHead></TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => {
                  const body =
                    cell.column.id === idColumn && clickableIdColumn ? (
                      <Button
                        className="p-0 text-muted-foreground"
                        variant="ghost"
                        onClick={() => onRowSelect?.(data[row.id][pkColumn])}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}

                        <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    );

                  return <TableCell key={cell.id}>{body}</TableCell>;
                })}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>...</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onRowEdit) onRowEdit(data[row.id][pkColumn]);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      {(deletable === undefined || deletable) && (
                        <DropdownMenuItem
                          onClick={() => {
                            if (onRowDelete)
                              onRowDelete(data[row.id][pkColumn]);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* +1 to accommodate edit button header */}
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
