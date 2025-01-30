import React, { useState } from "react";
import "./VideoCarousel.css";
import { useEffect } from "react";

const VideoCarousel = ({ videos }) => {
  // Lista de videos (pueden ser URLs o rutas locales)
  const [visibleThumbnails, setVisibleThumbnails] = useState(3);

  // Estado para el índice actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Funciones para cambiar el video
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos?.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos?.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const updateThumbnails = () => {
      if (window.innerWidth <= 768) {
        setVisibleThumbnails(2); // Muestra 2 en móvil
      } else {
        setVisibleThumbnails(3); // Muestra 3 en pantallas grandes
      }
    };

    updateThumbnails(); // Ajusta al cargar
    window.addEventListener("resize", updateThumbnails); // Ajusta al redimensionar

    return () => window.removeEventListener("resize", updateThumbnails); // Limpia el listener
  }, []);

  return (
    <div className="video__container">
      {/* Video principal */}
      <div>
        <video
          src={
            Array.isArray(videos) && videos?.length > 0
              ? `/uploads/${videos[currentIndex].file}`
              : ""
          }
          controls
        ></video>
      </div>

      {/* Controles */}
      <div className="video__nav-container">
        {/* Botón Anterior */}
        <button className="video__btn-controller" onClick={goToPrevious}>
          ◀
        </button>

        {/* Indicadores con vista previa de videos */}
        <div className="video__nav">
          {videos?.slice(0, visibleThumbnails).map((video, index) => (

            <div
              key={index}
              style={{
                border:
                  index === currentIndex
                    ? "1px solid #e9c524"
                    : "1px solid transparent",
              }}
              className="video__nav-view"
              onClick={() => setCurrentIndex(index)}
            >
              <video
                src={`/uploads/${video.file}`}
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none", // Evita cualquier interacción
                }}
              ></video>
            </div>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button className="video__btn-controller" onClick={goToNext}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;
