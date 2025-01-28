import React from "react";
import UserPanel from "@pages/UserPanel/UserPanel";
import Chat from "@components/Chat/Chat";
import Betting from "@components/Betting/Betting";
import Navbar from "@components/Navbar/Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Box } from "@mui/material";
import { getUser } from "@redux/features/userSlice";

import "./UserLayout.css";
import { useRef } from "react";
import { io } from "socket.io-client";

const UserLayout = () => {
  const dispatch = useDispatch();
  const userId = JSON.parse(Cookies.get("data")).id;
  const isOpen = useSelector((state) => state.chat.isOpen);
  const user = useSelector((state) => state.user.user);
  const event = useSelector((state) => state.lastEvent.event);

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch]);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_BETS);

    socket.current.on("connect", () => {
      console.log("Conectado al servidor de apuestas");
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.on("new-balance", (data) => {
      dispatch(getUser(userId));
    });
  }, []);

  return (
    <>
      <Navbar user={user} balance={user?.initial_balance} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: `300px 1fr ${isOpen ? "300px" : "0"}`,
          },
          gridTemplateRows: "auto",
          gap: {
            xs: "2rem",
          },
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            order: { xs: 2, lg: 1 },
            p: { xs: 0, md: 0 },
          }}
        >
          <Betting balance={user?.initial_balance} user={user} event={event} />
        </Box>

        <Box
          sx={{
            width: "100%",
            order: { xs: 1, lg: 2 },
          }}
        >
          <UserPanel name={event?.name} />
        </Box>

        <Box
          sx={{
            order: { xs: 3, lg: 3 },
          }}
        >
          <Chat />
        </Box>
      </Box>
    </>
  );
};

export default UserLayout;
