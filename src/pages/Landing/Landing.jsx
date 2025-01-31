import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getLastEvent } from "@redux/features/eventsSlice";
import { getPromotions } from "@redux/features/videosSlice";

import Header from "./sections/Header/Header";
import Events from "./sections/Events/Events";
import Modal from "@components/Modal/Modal";
import api from "@services/api";

import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import "./Landing.css";

const Landing = () => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.lastEvent.event);
  const [openRecharge, setOpenRecharge] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    dispatch(getLastEvent());
    dispatch(getPromotions());
  }, [dispatch]);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await api.get("https://stream.artegallera.com/livestream/live.m3u8");
        if (response.status === 200) {
          setIsLive(true);
        }
      } catch (error) {
      }
    };
    fetchStream();
  }, []);

  return (
    <>
      <Header live={isLive} />
      <Events name={event.name} date={event?.date} time={event?.time} />
      <button className="landing-button" onClick={() => setOpenRecharge(true)}>
        <span>
          Contantanos
        </span>
        <WhatsAppIcon color="white" fontSize="large" /> </button>
      <footer>
        <p>© Arte Gallera 2025. Todos los derechos reservados</p>
        <p>
          Queda estrictamente prohibida la venta, reproducción, distribución o
          retransmisión no autorizada de este contenido.
        </p>
      </footer>

      <Modal
        title="Recarga ahora"
        link="https://wa.me/524591087015"
        open={openRecharge}
        close={setOpenRecharge}
      >
        Hola, Para recargar comunícate por WhatsApp al numero{" "}
        <a style={{ color: "#4362a5" }} href="https://wa.me/524591087015">
          +52 1 459 108 7015
        </a>{" "}
        o dando clic en el siguiente enlace donde recibiras tu recarga, usuario
        y contraseña
      </Modal>
    </>
  );
};

export default Landing;
