import React from "react";
import AccountSidebar from "./components/AccountSidebar";
import AccountID from "./components/AccountID";
import UserProfile from "./components/UserProfile";
import HeaderAccountMgnt from "../../components/Header/HeaderAccountMgnt";

export default function Sample() {
  return (
    <div style={{ display: "flex", height: "100vh" ,}}>
      
      <AccountSidebar />
      <div style={{ marginLeft: "18vw", width: "85vw", display: "flex", flexDirection: "column" }}>
      <HeaderAccountMgnt/>
        <UserProfile />
      </div>
    </div>
  );
}
