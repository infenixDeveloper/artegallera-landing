import { useEffect, useState, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import PersonIcon from '@mui/icons-material/Person';
import "./Stream.css";
import { io } from "socket.io-client";

const Stream = ({ title }) => {
  const socket = useRef(null);
  const videoRef = useRef(null); // Referencia al elemento de video
  const [player, setPlayer] = useState(null);
  const [viewers, setViewers] = useState(20);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_BETS);

    socket.current.on("connect", () => {
    });

    socket.current.emit("getConnectedUsers", (response) => {
      setViewers(20 + Math.floor(response.connectedUsers / 3));
    });

    socket.current.on("connectedUsersUpdated", (data) => {
      setViewers(20 + Math.floor(data.connectedUsers / 3));
    });

    const interval = setInterval(() => {
      socket.current.emit("getConnectedUsers", (response) => {
        setViewers(20 + Math.floor(response.connectedUsers / 3));
      });
    }, 60000);

    return () => {
      if (socket.current) {
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

      _player.on("error", () => {
        setIsLive(false);
      });

      _player.on("playing", () => {
        setIsLive(true);
      });

      setPlayer(_player);

      return () => {
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);


  return (
    <div className="stream__container">
      <div className="stream__data">
        <h2>{title}</h2>
        {isLive &&
          <span>
            <PersonIcon /> {viewers} espectadores
          </span>
        }
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
