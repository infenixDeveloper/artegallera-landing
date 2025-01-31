import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPromotions } from "@redux/features/videosSlice";
import VideoCarousel from "@components/VideoCarousel/VideoCarousel";
import MoneyExplotion from "@components/MoneyExplosion/MoneyExplosion";
import MoneyRain from "@components/MoneyRain/MoneyRain";
import { Typography } from "@mui/material";
import logo from "@assets/images/arte-gallera-logo-2.png";
import "./Events.css";

const Events = ({ name, date, time }) => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos.filter((video) => !video.is_event_video));

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    dispatch(getPromotions());

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <section className="events__container" id="event">
      {isMobile && <MoneyRain />}
      <div className="events__header">
        <img src={logo} alt="Arte Gallera Logo" />
        {name && date && time ? (
          <div className="events__header-info">
            <h1>{name}</h1>
            <p>
              <span className="date">{new Date(date).toLocaleDateString("es-ES")}</span> -{" "}
              <span className="time">{new Date(`1970-01-01T${time}`).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
            </p>
          </div>
        ) : (
          <Typography variant="h4">Próximo evento a confirmar</Typography>
        )}
        <img src={logo} alt="Arte Gallera Logo" />
      </div>
      <div className="events__content">
        <div className="logo-img__container">
          <MoneyExplotion />
          <img src={logo} alt="Arte Gallera Logo" />
        </div>
        <VideoCarousel videos={videos} />
        <div className="logo-img__container">
          <MoneyExplotion />
          <img src={logo} alt="Arte Gallera Logo" />
        </div>
      </div>
    </section>
  );
};

export default Events;
