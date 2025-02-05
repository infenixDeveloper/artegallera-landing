import React, { useState, useEffect } from "react";
import "./VideoCarousel.css";

const VideoCarousel = ({ videos }) => {
  const [visibleThumbnails, setVisibleThumbnails] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentIndex(0);
    }
  }, [videos]);

  const startIndex = Math.max(
    0,
    Math.min(currentIndex - Math.floor(visibleThumbnails / 2), videos.length - visibleThumbnails)
  );

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const updateThumbnails = () => {
      setVisibleThumbnails(window.innerWidth <= 768 ? 2 : 3);
    };

    updateThumbnails();
    window.addEventListener("resize", updateThumbnails);
    return () => window.removeEventListener("resize", updateThumbnails);
  }, []);

  return (
    <div className="video__container">
      {/* Video principal */}
      <div>
        {videos.length > 0 && (
          <video
            key={currentIndex}  // 🔹 Forzar re-render al cambiar de video
            controls

          >
            <source src={`/uploads/${videos[currentIndex].file}`} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Controles */}
      <div className="video__nav-container">
        <button className="video__btn-controller left" onClick={goToPrevious}>
          ◀
        </button>

        <div className="video__nav">
          {videos.slice(startIndex, startIndex + visibleThumbnails).map((video, index) => (
            <div
              key={startIndex + index}
              style={{
                border: startIndex + index === currentIndex ? "1px solid #e9c524" : "1px solid transparent",
              }}
              className="video__nav-view"
              onClick={() => setCurrentIndex(startIndex + index)}
            >
              <video
                muted
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <source src={`/uploads/${video.file}`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        <button className="video__btn-controller right" onClick={goToNext}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;
