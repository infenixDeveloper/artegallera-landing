import React, { useEffect, useRef } from "react";
import "./MoneyExplosion.css";

// URL de la imagen del billete
const moneyImg = "https://pngimg.com/uploads/money/money_PNG3500.png";

const MoneyExplosion = () => {
  const containerRef = useRef(null); // Referencia al div container

  // Función para crear la explosión de billetes
  const createMoneyExplosion = () => {
    const container = containerRef.current; // Usar la referencia del div container

    if (!container) return; // Si no hay contenedor, salir de la función

    // Obtener el tamaño y la posición del contenedor
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Crear 30 billetes por cada explosión
    for (let i = 0; i < 30; i++) {
      let bill = document.createElement("img");
      bill.src = moneyImg;
      bill.classList.add("money"); // Agregar clase de estilo

      // Posición inicial en el centro del contenedor
      let x = containerWidth / 1.8;
      let y = containerHeight / 1.8;

      // Ángulo aleatorio para dispersar los billetes (en radianes)
      let angle = Math.random() * 2 * Math.PI;
      // Distancia aleatoria para la explosión
      let distance = Math.random() * 200 + 100; // Distancia entre 100px y 300px

      // Calculamos las coordenadas finales con el ángulo y la distancia
      let endX = x + Math.cos(angle) * distance;
      let endY = y + Math.sin(angle) * distance;

      // Establecer las propiedades de los billetes, con el movimiento aleatorio
      bill.style.left = `${x - 25}px`; // Desplazamos para centrar la imagen
      bill.style.top = `${y - 25}px`;  // Desplazamos para centrar la imagen
      container.appendChild(bill);

      // Añadir variables de posición final para la animación
      bill.style.setProperty('--endX', `${endX - x}px`);
      bill.style.setProperty('--endY', `${endY - y}px`);

      // Animación para desplazar los billetes
      bill.style.animation = `fly 2s ease-out forwards`;

      // Eliminar los billetes después de 2 segundos
      setTimeout(() => bill.remove(), 2000);
    }
  };

  // Ejecutar la función cada 2 segundos
  useEffect(() => {
    const interval = setInterval(createMoneyExplosion, 2000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="money-rain-container"></div>;
};

export default MoneyExplosion;