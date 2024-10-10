import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status) {
  const colors = {
    Paid: 'success', // Use 'success' color for paid
    Pending: 'error' // Use 'warning' color for pending
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns = [
  { field: 'bookingId', headerName: 'Booking ID', flex: 1, minWidth: 150 },
  { field: 'bookerName', headerName: 'Booker Name', flex: 1.5, minWidth: 200 },
  { field: 'unitName', headerName: 'Unit Name', flex: 1.5, minWidth: 200 },
  { field: 'noGuests', headerName: 'No. Guests', flex: 1, minWidth: 120 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 150, renderCell: (params) => renderStatus(params.value) },
];


export const rows = [
  { id: 1, bookingId: 'BK001', bookerName: 'John Doe', unitName: 'Deluxe Suite', noGuests: 2, status: 'Paid' },
  { id: 2, bookingId: 'BK002', bookerName: 'Jane Smith', unitName: 'Standard Room', noGuests: 1, status: 'Pending' },
  { id: 3, bookingId: 'BK003', bookerName: 'Robert Johnson', unitName: 'Family Room', noGuests: 4, status: 'Paid' },
  { id: 4, bookingId: 'BK004', bookerName: 'Emily Davis', unitName: 'Penthouse', noGuests: 3, status: 'Pending' },
  { id: 5, bookingId: 'BK005', bookerName: 'Michael Brown', unitName: 'Single Room', noGuests: 1, status: 'Paid' },
  { id: 6, bookingId: 'BK006', bookerName: 'Sarah Wilson', unitName: 'Double Room', noGuests: 2, status: 'Pending' },
  { id: 7, bookingId: 'BK007', bookerName: 'David Taylor', unitName: 'Suite', noGuests: 2, status: 'Paid' },
  { id: 8, bookingId: 'BK008', bookerName: 'Laura Anderson', unitName: 'Luxury Suite', noGuests: 5, status: 'Pending' },
  { id: 9, bookingId: 'BK009', bookerName: 'James Thomas', unitName: 'Economy Room', noGuests: 1, status: 'Paid' },
  { id: 10, bookingId: 'BK010', bookerName: 'Olivia Martinez', unitName: 'Executive Suite', noGuests: 3, status: 'Pending' },
];
