import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function DatePicker({ title, onChange, value }) {
  const [selectedTime, setSelectedTime] = React.useState(dayjs(value, 'HH:mm'));

  const handleTimeChange = (newValue) => {
    const formattedTime = newValue ? newValue.format('HH:mm') : null;
    setSelectedTime(newValue);
    onChange(formattedTime); // Pass the formatted time to the parent component
  };

  React.useEffect(() => {
    setSelectedTime(dayjs(value, 'HH:mm'));
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: "245px", mr: 1 }}>
        <Typography>{title}</Typography>
        <TimePicker
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </Stack>
    </LocalizationProvider>
  );
}
