import React from "react";

const Landing = React.lazy(() => import("@pages/Landing/Landing"));
const UserPanel = React.lazy(() => import("@layouts/UserLayout/UserLayout"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/",
    name: "Home",
    element: Landing,
    meta: {
      title: "Arte Gallera — Peleas de Gallos en Vivo y Apuestas",
      description: "Vive la emoción de las peleas de gallos en vivo. Apuestas en línea, streaming y resultados en Arte Gallera.",
      image: "https://artegallera.com/arte-gallera-logo.png",
      url: "https://artegallera.com/"
    }
  },
  {
    path: "/panel",
    name: "Panel de Usuario",
    element: UserPanel,
    meta: {
      title: "Panel de Usuario — Arte Gallera",
      description: "Accede a tu panel para gestionar tus apuestas, ver historiales y seguir streams en vivo.",
      image: "https://artegallera.com/arte-gallera-logo.png",
      url: "https://artegallera.com/panel"
    }
  },

];

export default routes;