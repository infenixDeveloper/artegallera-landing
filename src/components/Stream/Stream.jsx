import { useEffect, useState, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import PersonIcon from '@mui/icons-material/Person';
import "./Stream.css";
import { io } from "socket.io-client";
import api from "@services/api";

const Stream = ({ title }) => {
  const socket = useRef(null);
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [viewers, setViewers] = useState(20);
  const intervalRef = useRef(null);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await api.get("https://stream.artegallera.com/livestream/live.m3u8");

        if (response.status === 200) {
          setIsLive(true);
        }
      } catch (error) {
        console.error(error);

      }
    };
    fetchStream();
  }, []);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_CHAT);

    const updateViewers = () => {
      if (socket.current && socket.current.connected) {
        socket.current.emit("getConnectedUsers", (response) => {
          if (response && typeof response.connectedUsers === 'number') {
            setViewers(20 + Math.floor(response.connectedUsers / 2));
          }
        });
      }
    };

    socket.current.on("connect", () => {
      console.log("Socket de chat conectado");
      // Obtener usuarios conectados inmediatamente al conectar
      updateViewers();
    });

    socket.current.on("disconnect", () => {
      console.log("Socket de chat desconectado");
    });

    // Escuchar actualizaciones en tiempo real del servidor
    socket.current.on("connectedUsersUpdated", (data) => {
      if (data && typeof data.connectedUsers === 'number') {
        setViewers(20 + Math.floor(data.connectedUsers / 2));
      }
    });

    // Actualizar cada 60 segundos como respaldo (por si se pierde alguna actualización)
    intervalRef.current = setInterval(updateViewers, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (socket.current) {
        socket.current.off("connectedUsersUpdated");
        socket.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const _player = videojs(videoRef.current, {
        controls: true,
        autoplay: !isIOS(),
        responsive: true,
        fluid: true,
        preload: "auto",
        techOrder: ["html5"],
        sources: [
          {
            src: import.meta.env.VITE_API_URL_STREAM,
            type: "application/x-mpegURL",
          },
        ],
      });

      setPlayer(_player);

      return () => {
        if (_player) {
          _player.dispose();
        }
      };
    }
  }, []);

  return (
    <div className="stream__container">
      <div className="stream__data">
        <h2>{title}</h2>
        <span className={isLive ? "icono-parpadeante" : ""}>
          <PersonIcon /> {viewers} espectadores
        </span>
      </div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        preload="auto"
        playsInline
        type="application/x-mpegURL"
      ></video>
    </div>
  );
};

export default Stream;
