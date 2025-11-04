import React from 'react';
import { Box, Typography } from '@mui/material';

const MessageItem = ({ message, username }) => {
  // Función para generar un color consistente basado en el nombre del usuario
  const getUserColor = (username) => {
    if (!username) return '#888';
    
    const colors = [
      '#4caf50', // Verde
      '#2196f3', // Azul
      '#ff9800', // Naranja
      '#9c27b0', // Púrpura
      '#f44336', // Rojo
      '#00bcd4', // Cian
      '#ffeb3b', // Amarillo
      '#e91e63', // Rosa
      '#795548', // Marrón
      '#607d8b', // Azul gris
      '#8bc34a', // Verde claro
      '#ff5722', // Rojo naranja
    ];
    
    // Generar un índice basado en el nombre del usuario
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const renderContent = (content) => {
    // Si es un objeto con archivo multimedia
    if (typeof content === 'object' && content.type) {
      return (
        <>
          {content.type === 'image' && (
            <Box sx={{ mb: 0.5, mt: 0.5 }}>
              <img
                src={content.url}
                alt={content.name}
                onError={(e) => {
                  console.error('Error cargando imagen:', content.url);
                  e.target.style.display = 'none';
                }}
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <Typography variant="caption" sx={{ color: 'gray', display: 'block', mt: 0.5, fontSize: '11px' }}>
                {content.name}
              </Typography>
            </Box>
          )}
          {content.type === 'video' && (
            <Box sx={{ mb: 0.5, mt: 0.5 }}>
              <video
                controls
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px'
                }}
              >
                <source src={content.url} type={content.file?.type} />
                Tu navegador no soporta videos.
              </video>
              <Typography variant="caption" sx={{ color: 'gray', display: 'block', mt: 0.5, fontSize: '11px' }}>
                {content.name}
              </Typography>
            </Box>
          )}
          {content.text && (
            <Typography 
              component="div"
              sx={{ 
                color: 'white',
                fontSize: '14px',
                lineHeight: 1.4,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                fontFamily: 'inherit',
                mt: 0.5
              }}
            >
              {content.text}
            </Typography>
          )}
        </>
      );
    }

    return null;
  };

  const userColor = getUserColor(username);

  return (
    <Box sx={{ mb: 0.5 }}>
      <Typography 
        component="div" 
        sx={{ 
          color: 'white',
          fontSize: '14px',
          lineHeight: 1.4,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          fontFamily: 'inherit'
        }}
      >
        <Typography 
          component="span" 
          sx={{ 
            fontWeight: 'bold',
            color: userColor,
            fontSize: '14px',
            lineHeight: 1.4,
            fontFamily: 'inherit'
          }}
        >
          {username || 'Usuario'}:
        </Typography>
        {' '}
        {typeof message === 'object' && message.type ? (
          <Box component="div" sx={{ mt: 0.3 }}>
            {renderContent(message)}
          </Box>
        ) : (
          <Typography component="span" sx={{ fontSize: '14px', fontFamily: 'inherit' }}>
            {message}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default MessageItem;
