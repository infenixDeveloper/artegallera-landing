

# 🚀 Guía Rápida de Implementación SEO

Esta es una guía paso a paso para implementar las mejoras SEO más críticas en Arte Gallera.

---

## ⚡ Inicio Rápido (30 minutos)

### Paso 1: Instalar Dependencias (5 min)

```bash
cd /var/www/html/artegallera-landing
npm install react-helmet-async
npm install --save-dev vite-plugin-sitemap vite-plugin-compression
```

### Paso 2: Actualizar index.html (10 min)

Reemplazar el contenido de `index.html` con:

```html
<!DOCTYPE html>
<html lang="es" translate="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Básico -->
    <title>Arte Gallera - Apuestas en Vivo de Peleas de Gallos Online</title>
    <meta name="description" content="Disfruta de transmisiones en vivo de peleas de gallos y apuestas online. Sistema seguro, pagos rápidos y eventos en tiempo real. ¡Únete ahora!" />
    <meta name="keywords" content="peleas de gallos, apuestas online, streaming en vivo, arte gallera" />
    <meta name="robots" content="index, follow" />
    
    <!-- Canonical -->
    <link rel="canonical" href="https://artegallera.com/" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Arte Gallera - Apuestas en Vivo" />
    <meta property="og:description" content="Transmisiones en vivo y apuestas seguras" />
    <meta property="og:url" content="https://artegallera.com/" />
    <meta property="og:image" content="https://artegallera.com/og-image.jpg" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/arte-gallera-logo.png" />
    <link rel="apple-touch-icon" href="/arte-gallera-logo.png" />
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://api.artegallera.com" crossorigin />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Paso 3: Configurar Helmet en App (5 min)

**Archivo: `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
```

### Paso 4: Archivos Públicos (5 min)

Los archivos ya están creados:
- ✅ `/public/robots.txt`
- ✅ `/public/sitemap.xml`

### Paso 5: Crear Componente SEO (5 min)

**Archivo: `src/components/SEO/MetaTags.jsx`**

Copiar el contenido de `MetaTags.example.jsx` y adaptarlo.

---

## 📋 Checklist Inmediato

### ✅ Hoy (Prioridad Alta)

- [ ] Instalar `react-helmet-async`
- [ ] Actualizar `index.html` con meta tags
- [ ] Verificar `robots.txt` y `sitemap.xml`
- [ ] Añadir alt text a imágenes principales
- [ ] Registrar en Google Search Console

### ✅ Esta Semana (Prioridad Media)

- [ ] Crear imágenes Open Graph (1200x630px)
- [ ] Optimizar imágenes a formato WebP
- [ ] Implementar lazy loading en imágenes
- [ ] Crear páginas: FAQ, Cómo Funciona
- [ ] Configurar Google Analytics 4

### ✅ Este Mes (Prioridad Normal)

- [ ] Auditoría completa con Lighthouse
- [ ] Implementar Schema Markup
- [ ] Optimizar Core Web Vitals
- [ ] Crear estrategia de contenido
- [ ] Solicitar backlinks

---

## 🎯 Cambios Rápidos con Alto Impacto

### 1. Alt Text en Imágenes (5 min)

**Antes:**
```jsx
<img src="/logo.png" />
```

**Después:**
```jsx
<img 
  src="/logo.png" 
  alt="Arte Gallera - Plataforma de apuestas en vivo"
  loading="lazy"
  width="200"
  height="50"
/>
```

### 2. Títulos Jerárquicos (10 min)

Asegurarse de tener solo **un H1** por página:

```jsx
<section>
  <h1>Arte Gallera - Apuestas en Vivo</h1> {/* Solo uno por página */}
  <h2>¿Por qué elegirnos?</h2>
  <h3>Sistema seguro</h3>
  <h3>Pagos rápidos</h3>
  <h2>Eventos destacados</h2>
</section>
```

### 3. Enlaces Internos (10 min)

```jsx
<a href="/eventos">Ver eventos en vivo</a> {/* ✅ Descriptivo */}
<a href="/eventos">Clic aquí</a>         {/* ❌ Evitar */}
```

---

## 🔍 Verificación Inmediata

### Paso 1: Test de Meta Tags

Visitar: https://metatags.io/

Ingresar URL: `https://artegallera.com`

Verificar:
- ✅ Título correcto
- ✅ Descripción presente
- ✅ Imagen Open Graph
- ✅ Vista previa social correcta

### Paso 2: Test de Velocidad

Visitar: https://pagespeed.web.dev/

Ingresar URL: `https://artegallera.com`

Objetivo:
- **Desktop:** Score > 90
- **Mobile:** Score > 80

### Paso 3: Test de SEO

Visitar: https://seobility.net/en/seocheck/

Ingresar URL y revisar:
- Meta tags
- Títulos
- Enlaces
- Imágenes
- Estructura

---

## 📊 Monitoreo Semanal

### Semana 1-4: Fundamentos

```bash
# Verificar indexación
site:artegallera.com

# Buscar keywords
"arte gallera"
"apuestas gallos online"
"peleas de gallos en vivo"
```

### Métricas a Seguir

| Métrica | Semana 1 | Semana 4 | Meta |
|---------|----------|----------|------|
| Páginas indexadas | ? | ? | 100% |
| Posición promedio | ? | ? | Top 10 |
| Impresiones | ? | ? | +50% |
| Clics orgánicos | ? | ? | +30% |
| Page Speed Score | ? | ? | >90 |

---

## 🚨 Errores Críticos a Evitar

### ❌ NO Hacer

```jsx
// Título genérico
<title>Inicio</title>

// Sin alt text
<img src="/imagen.jpg" />

// URL no descriptiva
/page?id=123

// H1 múltiple
<h1>Título 1</h1>
<h1>Título 2</h1>
```

### ✅ SÍ Hacer

```jsx
// Título descriptivo
<title>Arte Gallera - Apuestas en Vivo de Peleas de Gallos</title>

// Con alt text
<img src="/evento.jpg" alt="Pelea de gallos en vivo - Evento principal" />

// URL descriptiva
/eventos/pelea-gallos-en-vivo

// Un solo H1
<h1>Eventos de Peleas de Gallos</h1>
<h2>Próximos eventos</h2>
```

---

## 🎓 Comandos Útiles

```bash
# Construir para producción
npm run build

# Vista previa de producción
npm run preview

# Analizar bundle
npm run build -- --mode analyze

# Verificar sitemap localmente
curl http://localhost:5173/sitemap.xml

# Test de robots.txt
curl http://localhost:5173/robots.txt
```

---

## 🔗 Links Rápidos

| Herramienta | URL | Uso |
|-------------|-----|-----|
| **PageSpeed** | https://pagespeed.web.dev/ | Velocidad |
| **Search Console** | https://search.google.com/search-console | Indexación |
| **Meta Tags Test** | https://metatags.io/ | Preview social |
| **Rich Results** | https://search.google.com/test/rich-results | Schema |
| **Lighthouse** | Chrome DevTools | Auditoría |

---

## 📞 Soporte

- 📚 Documentación completa: Ver `SEO_RECOMMENDATIONS.md`
- 🔍 Ejemplo de componente: Ver `MetaTags.example.jsx`
- 🤖 Robots.txt: `/public/robots.txt`
- 🗺️ Sitemap: `/public/sitemap.xml`

---

## ✅ Checklist Final Antes de Lanzar

```
[ ] Meta tags actualizados
[ ] Sitemap.xml accesible
[ ] Robots.txt configurado
[ ] Alt text en todas las imágenes
[ ] Un solo H1 por página
[ ] URLs descriptivas
[ ] Enlaces internos relevantes
[ ] Favicon presente
[ ] Open Graph configurado
[ ] Google Analytics instalado
[ ] Search Console configurado
[ ] Sitemap enviado a Google
[ ] Test de velocidad >80
[ ] Test mobile-friendly
[ ] HTTPS activo
[ ] Certificado SSL válido
```

---

**¡Listo para empezar! 🚀**

Tiempo estimado de implementación básica: **2-4 horas**  
Resultados visibles en: **2-4 semanas**

Para dudas, revisar la documentación completa en `SEO_RECOMMENDATIONS.md`

