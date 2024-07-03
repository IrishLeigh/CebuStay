import React from "react";
import AccountSidebar from "./components/AccountSidebar";
import AccountID from "./components/AccountID";
import UserProfile from "./components/UserProfile";

export default function Sample() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

        <AccountSidebar />
      <div style={{ marginLeft: "19vw", width: "81vw", display: "flex", flexDirection: "column" }}>
        <UserProfile />
      </div>
    </div>
  );
}
