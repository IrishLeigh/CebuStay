import * as React from "react";
import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" &&
    prop !== "isHovered" &&
    prop !== "isBooked" &&
    prop !== "bookingColor",
})(({ theme, isSelected, isHovered, isBooked, bookingColor, day }) => ({
  borderRadius: 0,

  ...(isBooked && {
    backgroundColor: bookingColor, // Use the assigned color for bookings
  }),

  pointerEvents: "none",
}));

function Day(props) {
  const { day, selectedDay, hoveredDay, bookedDates, ...other } = props;

  const booking = bookedDates.find((booking) =>
    day.isBetween(
      dayjs(booking.checkin_date),
      dayjs(booking.checkout_date),
      null,
      "[]"
    )
  );

  const isBooked = Boolean(booking);
  const bookingColor = isBooked ? booking.color : undefined;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5, fontSize: "1.125rem", margin: "0 auto" }} // CSS for Dates in Calendar
      disableMargin
      selected={false}
      isBooked={isBooked}
      bookingColor={bookingColor}
    />
  );
}

export default function WeekPicker({ unitTypes }) {
  const unitId = unitTypes.unitid;
  let [bookedDates, setBookedDates] = React.useState([]);
  //TO DO: Uncomment this if local storage does not work
  // const [user, setUser] = React.useState({});
  const userid = localStorage.getItem("userid") || null;

  // React.useEffect(() => {
  //   // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
  //   const token = localStorage.getItem("auth_token");

  //   // console.log("Token:", token);
  //   if (token) {
  //     const jwtToken = token.split("=")[1];
  //     axios
  //       .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
  //       .then((response) => {
  //         setUser(response.data["data"]);
  //         // loginUser(response.data.data);
  //         console.log("RESPONSE DATA: ", response.data["data"]);
  //       })
  //       .catch((error) => {
  //         alert("Error decoding JWT token:", error);
  //         setUser(null);
  //       });
  //   } else {
  //     setUser(null);
  //   }
  // }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!userid) return;
      try {
        const propertyres = await axios.get(
          "https://whitesmoke-shark-473197.hostingersite.com/api/property/bookings",
          {
            params: {
              userid: userid,
            },
          }
        );
        // Find the property with unitid matching unitTypes.unitid
        const matchingProperty = propertyres.data.filter(
          (property) => property.unitid === unitId
        );
        setBookedDates(matchingProperty);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userid]);

  // Sort booked dates by checkin_date
  bookedDates.sort((a, b) =>
    dayjs(a.checkin_date).isBefore(dayjs(b.checkin_date)) ? -1 : 1
  );

  // Assign alternating colors
  bookedDates = bookedDates.map((booking, index) => ({
    ...booking,
    color: index % 2 === 0 ? "#ffcccc" : "#cce5ff",
  }));

  return (
    <Paper sx={{ p: 2, width: "50rem", margin: "0 auto", mt: 5 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            width: "50rem",
            paddingBottom: "1rem",
            margin: "0 auto",
            // CSS for Days in Calendar Ex. (S M T W T F S)
            ".MuiDayCalendar-weekDayLabel": {
              /* Your styles here */
              px: 2.5,
              fontSize: "1.5rem",
              margin: "0 auto",
            },

            //CSS for Month Design and Button Ex. (May 2024 ↓ <>)
            ".MuiPickersCalendarHeader-root": {
              px: 2.5,
              fontSize: "2rem",
              margin: "0 auto",
              padding: "1rem",
              paddingBottom: "2rem",
              position:
                "relative" /* Ensure the element is positioned relative to position the underline correctly */,
              "&::after": {
                content: '""',
                display: "block",
                width: "100%" /* Full width underline */,
                height: ".1rem" /* Height of the underline */,
                backgroundColor: "black" /* Color of the underline */,
                position: "absolute",
                bottom: "1rem" /* Position it at the bottom */,
                left: 0,
              },
            },

            //CSS for Month Text Design  Ex. (May 2024)
            ".MuiPickersCalendarHeader-label": {
              px: 2.5,
              fontSize: "1.5rem",
              margin: "0 auto",
              padding: "1rem",
              justifyContent: "center",
            },
          }}
          showDaysOutsideCurrentMonth
          MuiDayCalendar-weekDayLabel
          displayWeekNumber={false}
          slots={{ day: Day }}
          slotProps={{
            day: (ownerState) => ({
              bookedDates,
            }),
          }}
        />
      </LocalizationProvider>
    </Paper>
  );
}
