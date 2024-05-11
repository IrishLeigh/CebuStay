import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function DatePicker(props) {
  const [value, setValue] = React.useState(null);

  const handleTimeChange = (newValue) => {
    const formattedTime = newValue ? dayjs(newValue).format('HH:mm') : null;
    setValue(newValue); // Update the state with the Date object
    props.onChange(formattedTime); // Pass the formatted time to the parent component
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: "245px", mr: 1 }}>
        <Typography>
          {props.title}
        </Typography>
        <TimePicker
          value={value}
          onChange={handleTimeChange} // Pass the formatted time to the parent component
        />
        {/* <Typography>
          Stored value: {value == null ? 'null' : dayjs(value).format('HH:mm')}
        </Typography> */}
      </Stack>
    </LocalizationProvider>
  );
}
