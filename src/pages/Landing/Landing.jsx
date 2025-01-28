import { useState, useEffect } from "react";
import Typography from "@components/Typography/Typography";

import Modal from "@components/Modal/Modal";
import Button from "@components/Button/Button";
import LoginModal from "@components/Login/components/LoginModal/LoginModal";

import userIcon from "@assets/images/user-icon.png";
import bagIcon from "@assets/images/bag-icon.png";

import { useDispatch, useSelector } from "react-redux";
import { getLastEvent } from "@redux/features/eventsSlice";
import { getPromotions } from "@redux/features/promotionsSlice";

import "./Landing.css";
import { Link } from "@mui/material";

const Landing = () => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.lastEvent.event);
  const promotions = useSelector((state) => state.promotions.promotions);

  const [openModal, setOpenModal] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);
  const [isActiveEvent, setIsActiveEvent] = useState("");
  const [promotion, setPromotion] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const HandleRecharge = () => {
    setOpenRecharge(true);
  };

  const calculateEventStatus = () => {
    if (!event || !event.date || !event.time) return;
    let isActive = false;
    const eventDate = new Date(event.date);
    const eventTime = event.time.split(":").map(Number);
    const eventDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      eventTime[0],
      eventTime[1] || 0
    );

    const now = new Date();

    if (now < eventDateTime) {
      isActive = true;
    } else {
      isActive = false;
    }

    return isActive;
  };

  const formatedDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    dispatch(getLastEvent());
    dispatch(getPromotions());
  }, [dispatch]);

  useEffect(() => {
    if (promotions?.promotions) {
      const sortedPromotions = [...promotions?.promotions].sort(
        (a, b) => b.id - a.id
      );
      const firstTwoPromotions = sortedPromotions.slice(0, 2);
      setPromotion(firstTwoPromotions);
    }
  }, [promotions]);

  useEffect(() => {
    setIsActiveEvent(calculateEventStatus());
  }, [event]);

  return (
    <>
      <div className="landing__container">
        <Typography variant="h1" className={"landing__title"}>
          Bienvenido a Arte Gallera
          <Typography variant="span">¡Suerte en tus apuestas!</Typography>
        </Typography>

        <Typography className="landing__title2">
          Hoy tenemos un gran evento,{" "}
          <Typography variant="span">
            no te pierdas la oportunidad de participar en nuestro evento, que
            comenzará a las {event?.time?.slice(0, 5)}.
          </Typography>
        </Typography>

        <div className="landing__stream-container">
          <div className="landing__stream">
            <div className="btn__container">
              <Button
                title="Iniciar Sesión"
                icon={userIcon}
                variant="outline"
                onClick={handleOpenModal}
              />
              <Button
                title="¡Recarga saldo ahora!"
                icon={bagIcon}
                variant="filled"
                onClick={HandleRecharge}
              />
            </div>
            <div className="stream-box">
              {promotion &&
                promotion.map((p) => (
                  <video key={p.id} controls playsInline>
                    <source src={`/uploads/${p.file}`} type="video/mp4" />
                    Tu navegador no soporta el video.
                  </video>
                ))}
            </div>

            <div>
              <Typography variant="h2">
                EL EVENTO DE HOY {formatedDate(event?.date)}
              </Typography>

              <div className="btn-container">
                <button className="landing__btn1">
                  {event?.name ? event?.name?.toUpperCase() : "ARTE GALLERA"}
                </button>
                <button className="landing__btn2">
                  <span>INICIO</span> <span>{event?.time?.slice(0, 5)}</span>{" "}
                  <span>pm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={openModal} close={setOpenModal} />

      <Modal
        title="Recarga ahora"
        link="https://wa.me/524591087015"
        open={openRecharge}
        close={setOpenRecharge}
      >
        Hola, Para recargar comunícate por WhatsApp al numero{" "}
        <Link
          sx={{ color: "#4362a5", textDecoration: "none" }}
          href="https://wa.me/524591087015"
        >
          +52 1 459 108 7015
        </Link>{" "}
        o dando clic en el siguiente enlace donde recibiras tu recarga, usuario
        y contraseña
      </Modal>
    </>
  );
};

export default Landing;
