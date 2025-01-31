import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPromotions } from "@redux/features/videosSlice";

import VideoCarousel from "@components/VideoCarousel/VideoCarousel";

import logo from "@assets/images/arte-gallera-logo-2.png";

import "./Events.css";
import MoneyRain from "@components/MoneyRain/MoneyExplosion";
import { Typography } from "@mui/material";

const Events = ({ name, date, time }) => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos.filter((video) => video.is_event_video === false));

  useEffect(() => {
    dispatch(getPromotions());
  }, [dispatch]);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options);
  }

  const formatTime = (time) => {
    if (!time || typeof time !== "string") return; // Maneja valores incorrectos

    const parts = time.split(":");
    if (parts.length < 2) return "Hora no válida"; // Evita errores si el formato no es HH:mm:ss

    const [hour, minute] = parts;
    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Convierte a formato AM/PM
    });
  };


  return (
    <>
      <section className="events__container" id="event">
        <div className="events__header">
          <img src={logo} alt="Arte Gallera Logo" />
          {
            name && date && time ? (

              <div className="events__header-info">
                <h1>{name}</h1>
                <p><span className="date">{formatDate(date)}</span> - <span className="time">{formatTime(time)}</span></p>
              </div>
            ) :
              <Typography variant="h4">
                Proximo evento a confirmar
              </Typography>
          }
          <img src={logo} alt="Arte Gallera Logo" />
        </div>
        <div className="events__content">
          <div className="logo-img__container">
            <MoneyRain />
            <img src={logo} alt="Arte Gallera Logo" />
          </div>
          <VideoCarousel videos={videos} />
          <div className="logo-img__container">
            <MoneyRain />
            <img src={logo} alt="Arte Gallera Logo" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
