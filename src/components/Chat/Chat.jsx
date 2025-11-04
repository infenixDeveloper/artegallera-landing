import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toggleChat } from "@redux/features/chatSlice";
import { getLastEvent } from "@redux/features/eventsSlice";
import { io } from "socket.io-client";
import { Box, IconButton, Tooltip, Typography, Button, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StartIcon from "@mui/icons-material/Start";
import BlockIcon from "@mui/icons-material/Block";
import EmojiPicker from "./EmojiPicker";
import MessageItem from "./MessageItem";
import api, { baseURL } from "@services/api";

// Determinar la URL del socket según el entorno
const CHAT_URL = import.meta.env.VITE_API_URL_CHAT || "wss://chat.artegallera.com";
const socket = io(CHAT_URL);

// Agregar logs de conexión de socket
socket.on("connect", () => {
  console.log("✅ [LANDING] Socket.IO conectado con ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ [LANDING] Socket.IO desconectado");
});

socket.on("connect_error", (error) => {
  console.error("❌ [LANDING] Error de conexión Socket.IO:", error);
});

const Chat = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.chat.isOpen);
  const activeEvent = useSelector((state) => state.lastEvent.event);

  // Calcular room dinámicamente basado en el evento activo
  // Manejar caso cuando activeEvent es array vacío, null o undefined
  console.log("🎯 [LANDING] Evento activo desde Redux:", activeEvent);
  
  // Validación mejorada para detectar evento válido
  const hasValidEvent = activeEvent && 
                        typeof activeEvent === 'object' && 
                        !Array.isArray(activeEvent) && 
                        Object.keys(activeEvent).length > 0 && 
                        activeEvent.id;
  
  const eventId = hasValidEvent ? activeEvent.id : null;
  const room = eventId ? String(eventId) : "general";
  
  console.log("🎯 [LANDING] ¿Tiene evento válido?:", hasValidEvent);
  console.log("🎯 [LANDING] eventId calculado:", eventId);
  console.log("🎯 [LANDING] room calculado:", room);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [isActiveChat, setIsActiveChat] = useState(true); // Estado para verificar si el usuario puede chatear
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const loadedMessageIds = useRef(new Set()); // Para evitar duplicados

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar evento activo si no está disponible
  useEffect(() => {
    if (!hasValidEvent) {
      console.log("⚠️ [LANDING] No hay evento activo, cargando desde API...");
      dispatch(getLastEvent());
    }
  }, [hasValidEvent, dispatch]);

  // Función para convertir mensajes de la API al formato del componente
  const formatApiMessage = (apiMessage) => {
    // Manejar diferentes estructuras de respuesta de la API
    const user = apiMessage.user || apiMessage.users || {};
    const username = user.username || 
                     user.email || 
                     (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
                     "Usuario";
    
    // Si el mensaje tiene una imagen, formatear como objeto especial
    let messageContent = apiMessage.content;
    if (apiMessage.message_type === 'image' && apiMessage.image_url) {
      messageContent = {
        type: 'image',
        url: `${baseURL}${apiMessage.image_url}`,
        name: apiMessage.image_name || 'Imagen',
        text: apiMessage.content || null
      };
    }
    
    return {
      id: apiMessage.id,
      username: username,
      message: messageContent,
      message_type: apiMessage.message_type,
      image_url: apiMessage.image_url,
      image_name: apiMessage.image_name,
      timestamp: apiMessage.createdAt,
      user_id: apiMessage.user_id,
      event_id: apiMessage.event_id
    };
  };

  // Función para cargar mensajes desde la API (optimizada para evitar parpadeo)
  // IMPORTANTE: Esta función NO verifica isActiveChat - los mensajes se cargan siempre
  // Los usuarios bloqueados pueden VER el historial, solo no pueden ENVIAR mensajes
  const loadMessagesFromAPI = useCallback(async (currentEventId = null, isInitialLoad = false) => {
    console.log("📥 [LANDING] loadMessagesFromAPI llamado con eventId:", currentEventId, "isInitialLoad:", isInitialLoad);
    
    if (isLoadingMessages && !isInitialLoad) {
      console.log("⏭️ [LANDING] Ya hay una carga en progreso, saltando");
      return;
    }
    
    // Solo mostrar el indicador de carga en la carga inicial
    if (isInitialLoad) {
      setIsLoadingMessages(true);
    }
    
    try {
      let response;
      console.log("🌐 [LANDING] Realizando petición API...");
      
      if (currentEventId) {
        // Cargar mensajes del evento específico
        console.log(`📡 [LANDING] GET /messages/event/${currentEventId}`);
        response = await api.get(`/messages/event/${currentEventId}`, {
          params: { limit: 100, offset: 0 }
        });
      } else {
        // Cargar mensajes generales (sin evento)
        console.log("📡 [LANDING] GET /messages/general");
        response = await api.get("/messages/general", {
          params: { limit: 100, offset: 0 }
        });
      }

      console.log("✅ [LANDING] Respuesta de la API:", {
        success: response.data?.success,
        messageCount: response.data?.data?.length,
        cached: response.data?.cached
      });

      if (response.data?.success && response.data?.data) {
        const apiMessages = response.data.data;
        
        // Formatear todos los mensajes de la API
        const formattedMessages = apiMessages
          .map(formatApiMessage)
          .reverse(); // Revertir para mostrar del más antiguo al más nuevo

        console.log(`📝 [LANDING] ${formattedMessages.length} mensajes formateados`);

        // Actualizar mensajes de forma optimizada sin parpadeo
        setMessages(prev => {
          // Crear un mapa de mensajes existentes por ID para búsqueda rápida
          const existingMessagesMap = new Map();
          prev.forEach(msg => {
            if (msg.id) {
              existingMessagesMap.set(msg.id, msg);
            }
          });

          // Crear mapa de nuevos mensajes
          const newMessagesMap = new Map();
          formattedMessages.forEach(msg => {
            newMessagesMap.set(msg.id, msg);
            loadedMessageIds.current.add(msg.id);
          });

          // Si es carga inicial o no hay mensajes previos, reemplazar todo
          if (isInitialLoad || prev.length === 0) {
            console.log("🔄 [LANDING] Carga inicial - reemplazando todos los mensajes");
            return formattedMessages;
          }

          // Combinar: mantener orden y agregar solo nuevos
          const combined = [...prev];
          let hasNewMessages = false;

          formattedMessages.forEach(newMsg => {
            if (!existingMessagesMap.has(newMsg.id)) {
              combined.push(newMsg);
              hasNewMessages = true;
            }
          });

          if (hasNewMessages) {
            console.log(`➕ [LANDING] ${hasNewMessages} mensajes nuevos agregados`);
            return combined.sort((a, b) => {
              const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
              const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
              return timeA - timeB;
            });
          }

          console.log("✅ [LANDING] Sin cambios en mensajes");
          return prev;
        });
      }
    } catch (error) {
      console.error("❌ [LANDING] Error al cargar mensajes desde la API:", error);
      if (error.response) {
        console.error("❌ [LANDING] Detalles del error:", error.response.data);
      }
    } finally {
      if (isInitialLoad) {
        setIsLoadingMessages(false);
      }
    }
  }, [isLoadingMessages]);

  // Cargar mensajes cuando cambia el evento activo
  useEffect(() => {
    console.log("📅 [LANDING] Evento cambió. eventId:", eventId, "| room:", room);
    
    // Limpiar mensajes y referencias cuando cambia el evento
    loadedMessageIds.current.clear();
    setMessages([]);
    
    // Cargar mensajes del evento activo (o generales si no hay evento)
    if (eventId) {
      console.log("📅 [LANDING] Cargando mensajes del evento:", eventId);
      loadMessagesFromAPI(eventId, true);
    } else {
      console.log("📅 [LANDING] Cargando mensajes generales (sin evento activo)");
      loadMessagesFromAPI(null, true);
    }
  }, [eventId]); // Se activa cuando eventId cambia

  // Sincronización automática cada 3 segundos (estilo Facebook Live)
  useEffect(() => {
    console.log("🔄 [LANDING] Iniciando sincronización automática cada 3 segundos para eventId:", eventId);
    
    // Función que se ejecutará cada 3 segundos
    const syncMessages = () => {
      // No es carga inicial, solo sincronización (isInitialLoad = false)
      loadMessagesFromAPI(eventId, false);
    };

    // Configurar intervalo de 3 segundos
    const intervalId = setInterval(syncMessages, 3000);

    // Limpiar intervalo al desmontar o cuando cambie el evento
    return () => {
      console.log("🛑 [LANDING] Deteniendo sincronización automática");
      clearInterval(intervalId);
    };
  }, [eventId]); // Re-iniciar intervalo cuando cambie el eventId

  // Verificación automática del estado de chat cada 3 segundos (con caché Redis)
  useEffect(() => {
    if (!userId) return;

    console.log("🔄 [LANDING] Iniciando verificación de estado de chat cada 3 segundos para userId:", userId);

    const checkChatStatus = async () => {
      try {
        const response = await api.get(`/user/${userId}/chat-status`);
        
        if (response.data?.success && response.data?.data) {
          const newStatus = response.data.data.is_active_chat;
          
          console.log(`🔍 [LANDING] Estado actual del usuario ${userId}:`, newStatus);
          
          // Actualizar siempre, comparando con el estado más reciente
          setIsActiveChat(prevStatus => {
            if (newStatus !== prevStatus) {
              console.log(`🔔 [LANDING] Estado de chat cambió de ${prevStatus} a ${newStatus}`);
              
              // Actualizar cookie
              try {
                const userData = Cookies.get("data");
                if (userData) {
                  const user = JSON.parse(userData);
                  user.is_active_chat = newStatus;
                  Cookies.set("data", JSON.stringify(user), { expires: 7 });
                  console.log("✅ [LANDING] Cookie actualizada con nuevo estado:", newStatus);
                }
              } catch (error) {
                console.error("❌ Error al actualizar cookie:", error);
              }
              
              return newStatus;
            }
            return prevStatus;
          });
        }
      } catch (error) {
        // Silenciar errores 404 para no llenar la consola
        if (error.response?.status !== 404) {
          console.warn("⚠️ Error al verificar estado de chat:", error.message);
        }
      }
    };

    // Verificar inmediatamente al montar
    checkChatStatus();

    // Luego cada 3 segundos
    const intervalId = setInterval(checkChatStatus, 3000);

    return () => {
      console.log("🛑 [LANDING] Deteniendo verificación de estado de chat para userId:", userId);
      clearInterval(intervalId);
    };
  }, [userId]); // Solo depende de userId, NO de isActiveChat

  // Unirse a la sala cuando cambia el room o se carga el usuario
  useEffect(() => {
    console.log("🔌 [LANDING] useEffect de join ejecutándose - room:", room);
    
    try {
      const userData = Cookies.get("data");
      if (userData) {
        const user = JSON.parse(userData);
        
        if (user) {
          setUsername(user?.username);
          setUserId(user?.id);
          // Verificar si el usuario tiene permiso para chatear
          // is_active_chat puede venir del login o tener valor por defecto true
          const activeChat = user?.is_active_chat !== undefined ? user.is_active_chat : true;
          setIsActiveChat(activeChat);
          console.log("👤 [LANDING] Usuario cargado:", {
            username: user?.username,
            id: user?.id,
            is_active_chat: activeChat
          });
          
          // Unirse a la sala correspondiente
          console.log(`🚪 [LANDING] Emitiendo join a sala: "${room}"`);
          socket.emit("join", room);
          console.log(`✅ [LANDING] Evento join emitido para sala: "${room}"`);
        } else {
          console.warn("⚠️ [LANDING] Cookie 'data' no contiene usuario válido");
        }
      } else {
        console.warn("⚠️ [LANDING] No se encontró cookie 'data'");
      }
    } catch (error) {
      console.error("❌ [LANDING] Error al leer datos del usuario desde cookies:", error);
    }
  }, [room]); // Ejecutar cuando cambia el room

  useEffect(() => {
    console.log("🔌 [LANDING] Configurando listeners de socket para eventId:", eventId, "room:", room);

    // Escuchar cambios en el estado del chat del usuario
    const handleChatStatusChanged = (data) => {
      console.log("📢 [LANDING] Cambio de estado de chat recibido:", data);
      
      // Si el usuario actual es el afectado, actualizar su estado
      if (data.userId === userId) {
        console.log(`🔔 [LANDING] Tu estado de chat ha cambiado: ${data.is_active_chat ? 'Activo' : 'Bloqueado'}`);
        setIsActiveChat(data.is_active_chat);
        
        // Actualizar la cookie del usuario
        try {
          const userData = Cookies.get("data");
          if (userData) {
            const user = JSON.parse(userData);
            user.is_active_chat = data.is_active_chat;
            Cookies.set("data", JSON.stringify(user), { expires: 7 });
          }
        } catch (error) {
          console.error("❌ Error al actualizar cookie:", error);
        }
      }
    };

    // Recibir historial de mensajes desde socket (legacy - no usar si hay evento)
    const handleMessageHistory = (historyMessages) => {
      console.log("📋 [LANDING] Historial recibido desde socket:", historyMessages?.length || 0, "mensajes");
      
      // Solo usar socket si no hay evento activo (los eventos usan API directamente)
      if (!eventId) {
        console.log("✅ [LANDING] Aplicando historial desde socket (chat general)");
        setMessages(historyMessages);
      } else {
        console.log("⚠️ [LANDING] Ignorando historial de socket (evento activo usa API)");
      }
    };

    // Recibir mensajes nuevos en tiempo real
    const handleMessage = (msgData) => {
      console.log("📨 [LANDING] Mensaje recibido por socket:", msgData);
      console.log("📨 [LANDING] eventId actual del chat:", eventId);
      
      // Convertir a números para comparación confiable
      const msgEventId = msgData.event_id !== null && msgData.event_id !== undefined ? Number(msgData.event_id) : null;
      const currentEventId = eventId ? Number(eventId) : null;
      
      console.log(`📨 [LANDING] Comparando - msgEventId: ${msgEventId}, currentEventId: ${currentEventId}`);
      
      // Filtrar mensajes según el evento actual
      if (currentEventId !== null) {
        // Hay evento activo: solo aceptar mensajes de ese evento
        if (msgEventId !== currentEventId) {
          console.log(`📨 [LANDING] Mensaje ignorado - no coincide con evento activo`);
          return;
        }
      } else {
        // No hay evento activo: solo aceptar mensajes generales (sin event_id)
        if (msgEventId !== null) {
          console.log(`📨 [LANDING] Mensaje ignorado - es de un evento pero estamos en chat general`);
          return;
        }
      }
      
      // Si el mensaje tiene ID y ya existe, no agregarlo
      if (msgData.id && loadedMessageIds.current.has(msgData.id)) {
        console.log(`📨 [LANDING] Mensaje duplicado ignorado (ID: ${msgData.id})`);
        return;
      }
      
      // Formatear mensaje con imagen si es necesario
      if (msgData.message_type === 'image' && msgData.image_url) {
        msgData.message = {
          type: 'image',
          url: `${baseURL}${msgData.image_url}`,
          name: msgData.image_name || 'Imagen',
          text: msgData.message || null
        };
      }
      
      console.log("📨 [LANDING] Agregando mensaje al estado");
      
      // Agregar el mensaje
      setMessages((prev) => {
        // Verificar duplicados antes de agregar
        const exists = prev.some(msg => 
          msg.id === msgData.id || 
          (msg.username === msgData.username && 
           msg.message === msgData.message && 
           Math.abs(new Date(msg.timestamp || Date.now()) - new Date(msgData.timestamp || Date.now())) < 1000)
        );
        
        if (exists) {
          console.log("📨 [LANDING] Mensaje duplicado detectado en el estado");
          return prev;
        }
        
        // Agregar ID al conjunto si existe
        if (msgData.id) {
          loadedMessageIds.current.add(msgData.id);
        }
        
        // Agregar mensaje y ordenar por timestamp
        const updated = [...prev, msgData];
        return updated.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt || Date.now()).getTime();
          const timeB = new Date(b.timestamp || b.createdAt || Date.now()).getTime();
          return timeA - timeB;
        });
      });
    };

    // Listener para eliminación de un mensaje en tiempo real
    const handleMessageDeleted = (data) => {
      console.log("🗑️ [LANDING] Mensaje eliminado recibido por socket:", data);
      if (data.messageId) {
        setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
        // También remover del conjunto de IDs cargados
        loadedMessageIds.current.delete(data.messageId);
      }
    };

    // Listener para eliminación de múltiples mensajes en tiempo real
    const handleMessagesDeleted = (data) => {
      console.log("🗑️ [LANDING] Múltiples mensajes eliminados recibidos por socket:", data);
      if (data.messageIds && Array.isArray(data.messageIds)) {
        setMessages(prev => prev.filter(msg => !data.messageIds.includes(msg.id)));
        // También remover del conjunto de IDs cargados
        data.messageIds.forEach(id => loadedMessageIds.current.delete(id));
      }
    };

    // Registrar todos los listeners
    socket.on("user:chatStatusChanged", handleChatStatusChanged);
    socket.on("messageHistory", handleMessageHistory);
    socket.on("message", handleMessage);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messagesDeleted", handleMessagesDeleted);

    console.log("✅ [LANDING] Listeners de socket configurados correctamente");

    return () => {
      console.log("🔌 [LANDING] Limpiando listeners de socket");
      socket.off("user:chatStatusChanged", handleChatStatusChanged);
      socket.off("messageHistory", handleMessageHistory);
      socket.off("message", handleMessage);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messagesDeleted", handleMessagesDeleted);
    };
  }, [eventId, userId]); // Solo depende de eventId y userId (room se deriva de eventId)

  const sendMessage = async () => {
    if (!message || !room || !userId || isSending) {
      return;
    }

    // Validar que el usuario tenga permiso para chatear (verificar desde cookies también)
    const userData = Cookies.get("data");
    let canChat = isActiveChat;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        canChat = user?.is_active_chat !== undefined ? user.is_active_chat : true;
        // Actualizar estado si cambió
        if (canChat !== isActiveChat) {
          setIsActiveChat(canChat);
        }
      } catch (error) {
        console.error("Error al leer datos del usuario:", error);
      }
    }

    if (!canChat) {
      alert("No tienes permiso para enviar mensajes. Contacta al administrador.");
      return;
    }

    const messageContent = message.trim();
    if (!messageContent) {
      return;
    }

    setIsSending(true);
    const messageData = {
      username,
      message: messageContent,
      user_id: userId
    };

    try {
      // Guardar el mensaje en la base de datos mediante la API
      const response = await api.post("/messages", {
        content: messageContent,
        user_id: userId,
        event_id: eventId || null
      });

      // Si la respuesta incluye el mensaje guardado, el servidor ya lo emitió por socket
      // El mensaje llegará automáticamente por socket, así que no necesitamos agregarlo manualmente
      // Solo esperamos a que llegue por socket para mantener consistencia
      // Si después de un tiempo no llega, lo agregamos manualmente como fallback
      if (response.data?.success && response.data?.data) {
        const savedMessage = formatApiMessage(response.data.data);
        loadedMessageIds.current.add(savedMessage.id);
        
        // Esperar un momento para que llegue por socket, si no llega en 500ms, agregarlo manualmente
        setTimeout(() => {
          setMessages((prev) => {
            const exists = prev.some(msg => msg.id === savedMessage.id);
            if (!exists) {
              const updated = [...prev, savedMessage];
              return updated.sort((a, b) => {
                const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
                const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
                return timeA - timeB;
              });
            }
            return prev;
          });
        }, 500);
      } else {
        // Fallback: enviar por socket si no tenemos la respuesta de la API
        socket.emit("message", room, messageData);
      }
      
      setMessage("");
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      
      // Aún así enviar por socket para que se vea en tiempo real
      // aunque falle el guardado en BD
      socket.emit("message", room, messageData);
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
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
        display: "flex",
        flexDirection: "column"
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

      {/* Área de mensajes - SIEMPRE VISIBLE independientemente de isActiveChat */}
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
          minHeight: 0, // Importante para que flex funcione correctamente
          marginBottom: "1rem"
        }}
      >
        {isLoadingMessages && (
          <Typography sx={{ color: '#888', fontSize: '12px', textAlign: 'center', py: 1 }}>
            Cargando mensajes...
          </Typography>
        )}
        {messages.length === 0 && !isLoadingMessages && (
          <Typography sx={{ color: '#888', fontSize: '12px', textAlign: 'center', py: 1 }}>
            {activeEvent?.id ? 'No hay mensajes para este evento' : 'No hay mensajes'}
          </Typography>
        )}
        {messages.map((msgData, index) => {
          // Manejar tanto el formato nuevo como el formato legacy
          if (typeof msgData === 'string') {
            // Formato legacy: "username: message" - extraer username y message
            const colonIndex = msgData.indexOf(':');
            if (colonIndex > 0) {
              const username = msgData.substring(0, colonIndex).trim();
              const message = msgData.substring(colonIndex + 1).trim();
              return (
                <MessageItem 
                  key={msgData.id || `legacy-${index}`} 
                  message={message} 
                  username={username}
                />
              );
            } else {
              // Si no hay dos puntos, mostrar como mensaje sin usuario
              return (
                <MessageItem 
                  key={msgData.id || `legacy-str-${index}`} 
                  message={msgData} 
                  username=""
                />
              );
            }
          } else {
            // Formato nuevo: objeto con username, message, id
            return (
              <MessageItem 
                key={msgData.id || `msg-${index}`} 
                message={msgData.message} 
                username={msgData.username}
              />
            );
          }
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input para mensajes */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
          flexShrink: 0 // Evita que se comprima
        }}
      >
        {/* Mensaje de bloqueo dinámico y en tiempo real */}
        {!isActiveChat && (
          <Alert 
            severity="error" 
            icon={<BlockIcon />}
            sx={{
              fontSize: "11px",
              fontWeight: "500",
              backgroundColor: "rgba(244, 67, 54, 0.12)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              borderRadius: "6px",
              color: "#ffffff",
              py: 0.8,
              px: 1.5,
              "& .MuiAlert-icon": {
                color: "#ef5350",
                fontSize: "18px",
                marginRight: "8px"
              },
              "& .MuiAlert-message": {
                width: "100%",
                padding: 0
              }
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
              <Typography sx={{ fontSize: "11px", fontWeight: "600", color: "#fff", letterSpacing: "0.3px" }}>
                Chat bloqueado
              </Typography>
              <Typography sx={{ fontSize: "9.5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                Puedes ver mensajes pero no enviarlos
              </Typography>
            </Box>
          </Alert>
        )}
        
        <Box 
          display="flex" 
          alignItems="center" 
          gap={0.5}
          sx={{
            backgroundColor: !isActiveChat ? "rgba(60, 60, 60, 0.5)" : "#333",
            borderRadius: "8px",
            padding: "4px",
            border: !isActiveChat ? "1px solid rgba(244, 67, 54, 0.4)" : "1px solid #555",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s ease",
            opacity: !isActiveChat ? 0.6 : 1
          }}
        >
          <input
            type="text"
            placeholder={isActiveChat ? "Escribe un mensaje..." : "No puedes enviar mensajes"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isActiveChat}
            style={{
              flex: 1,
              height: "32px",
              padding: "0 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              color: isActiveChat ? "white" : "#999",
              outline: "none",
              fontSize: "13px",
              cursor: isActiveChat ? "text" : "not-allowed",
              fontWeight: "normal"
            }}
          />
          
          {/* Botón de emoticonos */}
          <Box sx={{ opacity: !isActiveChat ? 0.3 : 1, pointerEvents: !isActiveChat ? "none" : "auto" }}>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </Box>
          
          <IconButton
            sx={{
              minWidth: "32px",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: !isActiveChat ? "rgba(244, 67, 54, 0.7)" : (message ? "#4caf50" : "#666"),
              color: "white",
              "&:hover": {
                backgroundColor: !isActiveChat ? "rgba(244, 67, 54, 0.85)" : (message ? "#45a049" : "#777")
              },
              "&:disabled": {
                backgroundColor: !isActiveChat ? "rgba(244, 67, 54, 0.7)" : "#666",
                color: !isActiveChat ? "rgba(255,255,255,0.9)" : "#888",
                opacity: !isActiveChat ? 0.8 : 0.5
              }
            }}
            onClick={sendMessage}
            type="button"
            disabled={!message || isSending || !isActiveChat}
            title={!isActiveChat ? "Chat bloqueado" : "Enviar mensaje"}
          >
            {!isActiveChat ? (
              <BlockIcon sx={{ fontSize: "16px" }} />
            ) : (
              <SendIcon sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </Box>

      </Box>
    </Box>
  );
};

export default Chat;
