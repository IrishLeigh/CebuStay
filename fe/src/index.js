import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider";
import { AuthProvider } from "./components/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <UserProvider>
          <GoogleOAuthProvider clientId="920285881473-smlrcn0ateosaice90avlnun8flk3sgk.apps.googleusercontent.com">
            <AuthProvider>
              <App />
            </AuthProvider>
          </GoogleOAuthProvider>
        </UserProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
