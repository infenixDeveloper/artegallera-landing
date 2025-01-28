import React from "react";

const Landing = React.lazy(() => import("@pages/Landing/Landing"));
const UserPanel = React.lazy(() => import("@layouts/UserLayout/UserLayout"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/",
    name: "Home",
    element: Landing,
  },
  {
    path: "/panel",
    name: "Panel de Usuario",
    element: UserPanel,
  },

];

export default routes;