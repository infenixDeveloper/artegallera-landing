import React, { useEffect, useRef } from "react";
import "./MoneyExplosion.css";

// URL de la imagen del billete
const moneyImg = "https://pngimg.com/uploads/money/money_PNG3500.png";

const MoneyExplosion = () => {
  const containerRef = useRef(null); // Referencia al div container

  // Función para crear la explosión de billetes
  const createMoneyExplosion = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const totalBills = 200;
    const angleStep = (2 * Math.PI) / totalBills; // Distribuir los ángulos equitativamente

    for (let i = 0; i < totalBills; i++) {
      let bill = document.createElement("img");
      bill.src = moneyImg;
      bill.classList.add("money");

      // Obtener el centro del contenedor
      let centerX = containerWidth / 2;
      let centerY = containerHeight / 2;

      // Distribuir los ángulos uniformemente y añadir variación mínima
      let angle = i * angleStep * 2; // Variación sutil

      let distance = Math.random() * 100 + 100; // Distancia controlada (100 a 300px)

      // Posición final del billete
      let endX = centerX + Math.cos(angle) * distance * 2;
      let endY = centerY + Math.sin(angle) * distance * 2;

      // Posicionar los billetes en el centro antes de animarlos
      bill.style.position = "absolute";
      bill.style.left = `${centerX}px`; // Ajuste para centrar la imagen
      bill.style.top = `${centerY}px`;

      let scale = Math.random() * 0.5 + 0.5; // Escala entre 0.75 y 1.25
      let rotation = Math.random(); // Rotación aleatoria

      bill.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

      container.appendChild(bill);

      // Variables para la animación
      bill.style.setProperty("--endY", `${endY - (centerY)}px`);
      bill.style.setProperty("--endX", `${endX - (centerX * 1.5)}px`);

      bill.style.animation = `fly 2s ease-out forwards`;

      // Eliminar el billete después de la animación
      setTimeout(() => bill.remove(), 4000);
    }
  };


  // Ejecutar la función cada 2 segundos
  useEffect(() => {
    const interval = setInterval(createMoneyExplosion, 3000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="money-rain-container"></div>;
};

export default MoneyExplosion;