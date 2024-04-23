import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormPropsTextFields from './textfield';

export default function ReferenceDateExplicitTimePicker(props) {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: "245px", mr: 1 }}>
      <Typography>
          {props.title}
        </Typography>
        <TimePicker
          value={value}
          onChange={setValue}
        />
        <Typography>
          Stored value: {value == null ? 'null' : dayjs(value).format('HH:mm')}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
