import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";
import Form from "./Login_User/Form";
import MenuAppBar from "./components/Header/AppBar";
import HeaderNoUser from "./components/Header/HeaderNoUser";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider";
import AccommodationReservation from "./components/AccommodationReservation";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

<BrowserRouter>
      <DataProvider>
        <UserProvider>
          <AccommodationReservation/>
          </UserProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
