import { useEffect, useState, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./Stream.css";

const Stream = () => {
  const videoRef = useRef(null); // Referencia al elemento de video
  const [player, setPlayer] = useState(null);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  useEffect(() => {
    // Asegúrate de que el elemento `video` esté montado
    if (videoRef.current) {
      const _player = videojs(videoRef.current, {
        controls: true,
        autoplay: !isIOS(), // Desactiva autoplay en iOS
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
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);

  return (
    <div className="stream__container">
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
