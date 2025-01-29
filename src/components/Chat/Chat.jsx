import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toggleChat } from "@redux/features/chatSlice";
import { io } from "socket.io-client";
import { Box, IconButton, Tooltip, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StartIcon from "@mui/icons-material/Start";

const socket = io(import.meta.env.VITE_API_URL_CHAT);

const Chat = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.chat.isOpen);

  const [room] = useState("general"); // Sala predeterminada
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0); // Estado del timer

  useEffect(() => {
    const user = JSON.parse(Cookies.get("data"));

    if (user) {
      setUsername(user?.username);
      socket.emit("join", room);
    }

    // Recibir mensajes
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageRejected", (errorMsg, time) => {
      alert(errorMsg); // Mostrar alerta (opcional)
      setTimeRemaining(time); // Configurar tiempo restante
    });

    // Detectar cuando alguien está escribiendo
    socket.on("typing", (username) => {
      setTyping(`${username} está escribiendo...`);
    });

    // Detectar cuando dejan de escribir
    socket.on("stopTyping", () => {
      setTyping("");
    });

    return () => {
      socket.off("message");
      socket.off("messageRejected");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [room]);

  useEffect(() => {
    // Manejar cuenta regresiva
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Limpiar intervalo al desmontar
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (message && room) {
      socket.emit("message", room, { username, message });
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (room) {
      socket.emit("typing", room, username);
      setTimeout(() => socket.emit("stopTyping", room, username), 1000);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "55px", md: "65px" },
        right: "0",
        width: "300px",
        height: { xs: "calc(100dvh - 55px)", md: "calc(100dvh - 65px)" },
        padding: "1rem",
        backgroundColor: "#333",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        zIndex: 10,


      }}
    >
      {/* Botón para abrir/cerrar */}
      <Box>
        <Tooltip title={isOpen ? "Cerrar" : "Abrir"} placement="left">
          <Button
            sx={{ position: "absolute", left: isOpen ? ".5rem" : "-90px", color: "white" }}
            onClick={() => dispatch(toggleChat())}
          >
            {isOpen ? "Cerrar" : <Typography display="flex" alignItems="center" gap={".2rem"}> <StartIcon sx={{ transform: isOpen ? "rotate(0)" : "rotate(180deg)" }} /> Chat</Typography>}
          </Button>
        </Tooltip>
      </Box>

      {/* Área de mensajes */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          marginTop: "3rem",
          color: "text.primary",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5rem",
          color: "white",
          backgroundColor: "#222",
          height: "calc(100% - 100px)",
        }}
      >
        {messages.map((msg, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
            {msg}
          </Typography>
        ))}
        {typing && (
          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", color: "gray" }}
          >
            {typing}
          </Typography>
        )}
      </Box>

      {/* Input para mensajes */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        sx={{
          display: "grid",
          height: "50px",
          gap: ".3rem",
          bottom: "1rem",
          width: "100%",
        }}
      >
        <Box display="flex" alignItems="flex-end">
          <input
            type="text"
            placeholder="Escribe un mensaje"
            value={message}
            disabled={timeRemaining > 0}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            style={{
              width: "100%",
              height: "35''''''''opx",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#222",
              color: "white"
            }}
          />
          {/* Mostrar tiempo restante */}
          {timeRemaining > 0 ? (
            <Typography
              variant="body2"
              sx={{
                display: "grid",
                placeItems: "center",
                color: "error.main",
                width: "36px",
                height: "34px",

              }}
            >
              {formatTime(timeRemaining)}
            </Typography>
          ) : (
            <Button
              sx={{
                minWidth: 0,
              }}
              onClick={sendMessage}
              type="button"
              disabled={timeRemaining > 0}
            >
              <SendIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
