import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider";
import SinglePropertyUI from "./pages/PropertyDetailsUI/components/SinglePropertyUI";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

<BrowserRouter>
      <DataProvider>
        <UserProvider>
          <SinglePropertyUI/>
          </UserProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
