import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider";
import SinglePropertyUI from "./pages/PropertyDetailsUI/components/SinglePropertyUI";
import Sample from "./pages/AccountManagement/Sample";
import AccountManagement from "./pages/AccountManagement/Layout/AccountManagement";
import Sidebar from "./pages/PropertyManagementUI/components/sidebar";
import AccommodationRegistration from "./pages/AccommodationRegistrationUI/AccommodationRegistration";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GettingStartedRegistration from "./pages/AccommodationRegistrationUI/components/GettingStarttedRegistration";
import InteractiveMap from "./InteractiveMap/InteractiveMap";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <DataProvider>
        <UserProvider>
          <GoogleOAuthProvider clientId="920285881473-smlrcn0ateosaice90avlnun8flk3sgk.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </UserProvider>
      </DataProvider>
    </BrowserRouter> */}
    <InteractiveMap />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
