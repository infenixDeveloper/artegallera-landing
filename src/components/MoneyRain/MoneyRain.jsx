import React, { useEffect, useRef } from "react";
import "./MoneyRain.css"; // Asegúrate de incluir los estilos necesarios

const MoneyRain = () => {
    const rainContainerRef = useRef(null);

    // Función para crear un billete
    const createMoney = () => {
        const rainContainer = rainContainerRef.current;
        if (!rainContainer) return;

        const money = document.createElement("div");
        money.classList.add("money-rain");

        // Posición horizontal inicial aleatoria
        const initialLeft = Math.random() * 100; // En porcentaje
        money.style.left = initialLeft + "%";

        // Establece una velocidad de caída aleatoria
        const speed = Math.random() * 1 + 1; // Entre 1 y 3 píxeles por frame

        // Establece la amplitud y frecuencia de oscilación
        const amplitude = Math.random() * 10 + 40; // Entre 10px y 40px
        const frequency = Math.random() * 0.05 + 0.01; // Entre 0.01 y 0.06 (más alto = más rápido)

        // Posiciones iniciales
        let topPosition = 0;
        let frame = 0; // Contador de frames para controlar la oscilación

        // Añade el billete al contenedor
        rainContainer.appendChild(money);

        // Maneja la animación manualmente
        const fall = () => {
            topPosition += speed; // Incrementa la posición vertical
            const offset = Math.sin(frame * frequency) * amplitude; // Calcula el desplazamiento oscilatorio
            money.style.top = topPosition + "px";
            money.style.left = `calc(${initialLeft}vw + ${offset}px)`; // Aplica la oscilación

            frame++; // Avanza el contador de frames

            // Si el billete sale de la pantalla, se elimina
            if (topPosition > window.innerHeight) {
                money.remove();
            } else {
                requestAnimationFrame(fall); // Llama a la función nuevamente
            }
        };

        requestAnimationFrame(fall); // Inicia la caída
    };

    useEffect(() => {
        // Genera billetes continuamente
        const interval = setInterval(createMoney, 500);

        // Limpieza al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    return <div className="rain" ref={rainContainerRef}></div>;
};

export default MoneyRain;