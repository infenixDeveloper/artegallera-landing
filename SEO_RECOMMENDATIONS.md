# 🚀 Guía de Posicionamiento SEO - Arte Gallera Landing

Este documento contiene recomendaciones y mejores prácticas para optimizar el SEO del sitio web Arte Gallera.

---

## 📋 Índice

1. [Optimización HTML y Meta Tags](#1-optimización-html-y-meta-tags)
2. [Optimización de Contenido](#2-optimización-de-contenido)
3. [Optimización Técnica](#3-optimización-técnica)
4. [Optimización de Imágenes](#4-optimización-de-imágenes)
5. [SEO Local](#5-seo-local)
6. [Performance y Core Web Vitals](#6-performance-y-core-web-vitals)
7. [Schema Markup (Datos Estructurados)](#7-schema-markup-datos-estructurados)
8. [Sitemap y Robots.txt](#8-sitemap-y-robotstxt)
9. [Social Media y Open Graph](#9-social-media-y-open-graph)
10. [Monitoreo y Analytics](#10-monitoreo-y-analytics)
11. [Checklist de Implementación](#11-checklist-de-implementación)

---

## 1. Optimización HTML y Meta Tags

### 🎯 Meta Tags Esenciales

Actualizar el archivo `index.html`:

```html
<!DOCTYPE html>
<html lang="es" translate="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Meta Tags SEO Básicos -->
    <title>Arte Gallera - Apuestas en Vivo de Peleas de Gallos Online</title>
    <meta name="description" content="Disfruta de transmisiones en vivo de peleas de gallos y apuestas online. Sistema seguro, pagos rápidos y eventos en tiempo real. ¡Únete ahora!" />
    <meta name="keywords" content="peleas de gallos, apuestas online, streaming en vivo, arte gallera, apuestas deportivas, gallos de pelea" />
    <meta name="author" content="Arte Gallera" />
    <meta name="robots" content="index, follow" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://artegallera.com/" />
    
    <!-- Meta Tags de Idioma -->
    <meta http-equiv="content-language" content="es" />
    <link rel="alternate" hreflang="es" href="https://artegallera.com/" />
    
    <!-- Open Graph (Facebook, LinkedIn) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Arte Gallera" />
    <meta property="og:title" content="Arte Gallera - Apuestas en Vivo de Peleas de Gallos" />
    <meta property="og:description" content="Transmisiones en vivo, apuestas seguras y eventos en tiempo real" />
    <meta property="og:url" content="https://artegallera.com/" />
    <meta property="og:image" content="https://artegallera.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="es_ES" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Arte Gallera - Apuestas en Vivo" />
    <meta name="twitter:description" content="Transmisiones en vivo y apuestas seguras" />
    <meta name="twitter:image" content="https://artegallera.com/twitter-card.jpg" />
    
    <!-- Favicon Completo -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#1a1a1a" />
    
    <!-- DNS Prefetch y Preconnect -->
    <link rel="dns-prefetch" href="//api.artegallera.com" />
    <link rel="preconnect" href="https://api.artegallera.com" crossorigin />
    
    <title>Arte Gallera</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 2. Optimización de Contenido

### 📝 Estrategia de Palabras Clave

**Palabras clave principales:**
- Arte gallera
- Peleas de gallos online
- Apuestas de gallos en vivo
- Streaming peleas de gallos
- Apuestas deportivas gallos

**Palabras clave secundarias:**
- Transmisiones en vivo gallos
- Apuestas seguras online
- Sistema de apuestas en tiempo real
- Eventos de peleas de gallos
- Plataforma de apuestas

### ✍️ Estructura de Contenido

1. **Títulos jerárquicos (H1-H6):**
   ```jsx
   // Componente ejemplo
   <section>
     <h1>Arte Gallera - Apuestas en Vivo</h1>
     <h2>¿Por qué elegir Arte Gallera?</h2>
     <h3>Sistema de apuestas seguro</h3>
     <p>Contenido optimizado con palabras clave...</p>
   </section>
   ```

2. **Contenido de calidad:**
   - Mínimo 300 palabras por página principal
   - Incluir preguntas frecuentes (FAQ)
   - Crear secciones "Cómo funciona"
   - Añadir testimonios de usuarios

3. **Llamadas a la acción (CTA):**
   - Botones descriptivos: "Registrarse Ahora" en lugar de "Clic Aquí"
   - Enlaces internos relevantes

---

## 3. Optimización Técnica

### ⚙️ Configuración de React Router

Implementar SEO-friendly routing:

```jsx
// src/components/SEO/MetaTags.jsx
import { Helmet } from 'react-helmet-async';

export const MetaTags = ({ 
  title, 
  description, 
  keywords,
  image,
  url 
}) => {
  const siteUrl = 'https://artegallera.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`;
  
  return (
    <Helmet>
      <title>{title} | Arte Gallera</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
```

### 📦 Instalación de dependencias SEO

```bash
npm install react-helmet-async
npm install --save-dev vite-plugin-sitemap
```

### 🔧 Configuración Vite

Actualizar `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://artegallera.com',
      dynamicRoutes: [
        '/',
        '/eventos',
        '/como-apostar',
        '/contacto',
        '/terminos',
        '/privacidad'
      ],
      exclude: ['/admin', '/perfil'],
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
```

### 🔄 Server-Side Rendering (SSR) opcional

Para mejor SEO, considera migrar a:
- **Vite SSR** (requiere configuración adicional)
- **Next.js** (alternativa recomendada)
- **Remix** (framework moderno)

---

## 4. Optimización de Imágenes

### 🖼️ Mejores Prácticas

1. **Formato WebP:**
   ```bash
   # Convertir imágenes a WebP
   cwebp logo.png -o logo.webp -q 80
   ```

2. **Imágenes responsive:**
   ```jsx
   <picture>
     <source srcset="/images/banner-mobile.webp" media="(max-width: 768px)" type="image/webp" />
     <source srcset="/images/banner-desktop.webp" media="(min-width: 769px)" type="image/webp" />
     <img 
       src="/images/banner.jpg" 
       alt="Arte Gallera - Apuestas en vivo de peleas de gallos" 
       loading="lazy"
       width="1200"
       height="630"
     />
   </picture>
   ```

3. **Alt text descriptivo:**
   - ✅ `alt="Pelea de gallos en vivo - Arte Gallera"`
   - ❌ `alt="imagen1"` o `alt=""`

4. **Lazy loading:**
   ```jsx
   <img src="..." alt="..." loading="lazy" />
   ```

### 📐 Dimensiones recomendadas

- **Logo:** 512x512px (PNG/WebP)
- **Open Graph:** 1200x630px
- **Twitter Card:** 1200x675px
- **Favicon:** 32x32px, 16x16px
- **Apple Touch Icon:** 180x180px

---

## 5. SEO Local

### 📍 Optimización Local

1. **Crear Google My Business** (si aplica)
2. **Schema markup local:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Arte Gallera",
  "url": "https://artegallera.com",
  "logo": "https://artegallera.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "customer service",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": [
    "https://facebook.com/artegallera",
    "https://twitter.com/artegallera",
    "https://instagram.com/artegallera"
  ]
}
```

---

## 6. Performance y Core Web Vitals

### ⚡ Métricas Objetivo

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Velocidad de carga |
| **FID** (First Input Delay) | < 100ms | Interactividad |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Estabilidad visual |
| **FCP** (First Contentful Paint) | < 1.8s | Primer contenido |
| **TTI** (Time to Interactive) | < 3.8s | Tiempo interactivo |

### 🚀 Optimizaciones

```javascript
// 1. Code splitting
const EventosPage = lazy(() => import('./pages/Eventos'));
const ComoApostarPage = lazy(() => import('./pages/ComoApostar'));

// 2. Preload recursos críticos
<link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin />

// 3. Comprimir assets
// En vite.config.js
import viteCompression from 'vite-plugin-compression';

export default {
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]
}
```

### 📊 Herramientas de medición

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Lighthouse:** Chrome DevTools
- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/

---

## 7. Schema Markup (Datos Estructurados)

### 🏷️ Implementación

Crear componente `StructuredData.jsx`:

```jsx
export const StructuredData = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://artegallera.com/#website",
        "url": "https://artegallera.com/",
        "name": "Arte Gallera",
        "description": "Plataforma de apuestas en vivo de peleas de gallos",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://artegallera.com/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://artegallera.com/#organization",
        "name": "Arte Gallera",
        "url": "https://artegallera.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://artegallera.com/logo.png",
          "width": 512,
          "height": 512
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://artegallera.com/#webpage",
        "url": "https://artegallera.com/",
        "name": "Arte Gallera - Inicio",
        "isPartOf": {
          "@id": "https://artegallera.com/#website"
        },
        "about": {
          "@id": "https://artegallera.com/#organization"
        }
      }
    ]
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
```

**Validar con:** https://search.google.com/test/rich-results

---

## 8. Sitemap y Robots.txt

### 🗺️ Sitemap.xml

Crear `/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://artegallera.com/</loc>
    <lastmod>2025-11-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://artegallera.com/eventos</loc>
    <lastmod>2025-11-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://artegallera.com/como-apostar</loc>
    <lastmod>2025-11-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 🤖 Robots.txt

Crear `/public/robots.txt`:

```text
# Robots.txt - Arte Gallera
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /perfil/
Disallow: /*.json$

# Sitemap
Sitemap: https://artegallera.com/sitemap.xml

# Crawl-delay (opcional)
Crawl-delay: 1
```

---

## 9. Social Media y Open Graph

### 📱 Imágenes para redes sociales

Crear las siguientes imágenes:

1. **og-image.jpg** (1200x630px) - Para Facebook, LinkedIn
2. **twitter-card.jpg** (1200x675px) - Para Twitter
3. **instagram-preview.jpg** (1080x1080px) - Para Instagram

### 🎨 Diseño recomendado

- Logo centrado
- Texto claro y legible
- Colores de marca
- Sin texto pequeño (será ilegible en miniaturas)

---

## 10. Monitoreo y Analytics

### 📈 Google Analytics 4

```jsx
// src/utils/analytics.js
export const initGA = () => {
  // Google Analytics 4
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
};

export const trackPageView = (url) => {
  if (window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
};
```

### 🔍 Google Search Console

1. **Verificar propiedad:** https://search.google.com/search-console
2. **Enviar sitemap:** Agregar `https://artegallera.com/sitemap.xml`
3. **Monitorear:**
   - Impresiones
   - Clics
   - CTR (Click-Through Rate)
   - Posición promedio
   - Errores de indexación

### 📊 Herramientas adicionales

- **Bing Webmaster Tools**
- **Ahrefs** (análisis de backlinks)
- **SEMrush** (investigación de palabras clave)
- **Google Trends** (tendencias de búsqueda)

---

## 11. Checklist de Implementación

### ✅ Fase 1: Fundamentos (Semana 1)

- [ ] Actualizar meta tags en `index.html`
- [ ] Instalar `react-helmet-async`
- [ ] Crear componente `MetaTags`
- [ ] Añadir favicon completo
- [ ] Crear `robots.txt`
- [ ] Crear `sitemap.xml`
- [ ] Configurar Google Analytics 4
- [ ] Registrar en Google Search Console

### ✅ Fase 2: Contenido (Semana 2)

- [ ] Optimizar títulos (H1-H6)
- [ ] Añadir alt text a todas las imágenes
- [ ] Crear página "Cómo funciona"
- [ ] Crear página FAQ
- [ ] Implementar breadcrumbs
- [ ] Optimizar URLs (limpias y descriptivas)
- [ ] Añadir enlaces internos relevantes

### ✅ Fase 3: Técnica (Semana 3)

- [ ] Implementar lazy loading
- [ ] Optimizar imágenes (WebP)
- [ ] Configurar code splitting
- [ ] Implementar Schema Markup
- [ ] Optimizar Core Web Vitals
- [ ] Configurar compresión Gzip/Brotli
- [ ] Implementar caché del navegador

### ✅ Fase 4: Social y Local (Semana 4)

- [ ] Crear imágenes Open Graph
- [ ] Configurar Twitter Cards
- [ ] Crear perfiles en redes sociales
- [ ] Configurar Google My Business (si aplica)
- [ ] Solicitar backlinks de calidad
- [ ] Crear contenido compartible

### ✅ Fase 5: Monitoreo (Continuo)

- [ ] Revisar Search Console semanalmente
- [ ] Analizar Analytics mensualmente
- [ ] Auditoría SEO trimestral
- [ ] Actualizar contenido regularmente
- [ ] Monitorear competencia
- [ ] A/B testing de títulos y descripciones

---

## 📚 Recursos Adicionales

### 🔗 Links útiles

- **Guía SEO de Google:** https://developers.google.com/search/docs
- **Web.dev:** https://web.dev/
- **Schema.org:** https://schema.org/
- **Can I Use:** https://caniuse.com/
- **GTmetrix:** https://gtmetrix.com/

### 📖 Lecturas recomendadas

- "The Art of SEO" - Eric Enge
- "SEO 2024" - Adam Clarke
- Blog de Moz: https://moz.com/blog
- Search Engine Journal: https://www.searchenginejournal.com/

---

## 🎯 KPIs a Monitorear

| KPI | Objetivo Mensual | Herramienta |
|-----|------------------|-------------|
| Tráfico orgánico | +20% | Google Analytics |
| Posición promedio | Top 10 | Search Console |
| CTR orgánico | >3% | Search Console |
| Páginas indexadas | 100% | Search Console |
| Page Speed Score | >90 | PageSpeed Insights |
| Backlinks | +10/mes | Ahrefs/SEMrush |
| Conversiones | +15% | Google Analytics |

---

## 🚨 Errores Comunes a Evitar

❌ **NO hacer:**
- Keyword stuffing (saturar de palabras clave)
- Comprar backlinks de baja calidad
- Contenido duplicado
- URLs con parámetros excesivos
- Ignorar mobile-first
- Textos ocultos o enlaces engañosos
- Cloaking (mostrar contenido diferente a bots)

✅ **SÍ hacer:**
- Contenido original y valioso
- Enlaces naturales y relevantes
- Estructura clara y jerárquica
- URLs amigables
- Diseño responsive
- Experiencia de usuario excelente
- Actualizaciones regulares

---

## 📞 Soporte y Consultas

Para dudas sobre la implementación de SEO en Arte Gallera:
- Revisar documentación oficial de React y Vite
- Consultar Google Search Central
- Realizar auditorías periódicas con Lighthouse

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0  
**Próxima revisión:** Febrero 2026

---

> 💡 **Nota:** El SEO es un proceso continuo. Los resultados pueden tardar 3-6 meses en ser visibles. La consistencia y la calidad del contenido son clave para el éxito.

