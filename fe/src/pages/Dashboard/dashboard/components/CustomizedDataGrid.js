import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData';

export default function CustomizedDataGrid({bookingList}) {
  const bookingrRows = bookingList.map((booking, index) => ({
    id: index + 1,  // or use booking.bookingid if you want bookingid as id
    bookingId: `BK00${booking.bookingid}`,  // format the booking ID as desired
    bookerName: booking.booker_name,
    unitName: booking.unit_name,
    noGuests: booking.guest_count,
    status: booking.status,
  }));
  
  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={bookingrRows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
