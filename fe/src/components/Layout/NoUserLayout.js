import { Outlet } from "react-router-dom";
import HeaderNoUser from "../Header/HeaderNoUser";

const NoUserLayout = () => {
  return (
    <>
      <HeaderNoUser />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default NoUserLayout;
