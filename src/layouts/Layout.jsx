import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "../routes";

import "./Layout.css";
import { Box } from "@mui/material";
import bgLanding from "@assets/images/bg-landing.webp";

const Layout = () => {
  const theme = localStorage.getItem("theme");

  return (
    <Box
      className="layout__container"
      sx={{
        backgroundImage: `${
          theme === "dark"
            ? "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))"
            : "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) "
        } , url(${bgLanding})`,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route, index) => {
            return (
              route.element && (
                <Route
                  key={route.name}
                  path={route.path}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

export default Layout;
