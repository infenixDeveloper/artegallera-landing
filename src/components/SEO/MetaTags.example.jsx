/**
 * Componente MetaTags para SEO
 * 
 * Instalar dependencia:
 * npm install react-helmet-async
 * 
 * Uso en App.jsx:
 * import { HelmetProvider } from 'react-helmet-async';
 * 
 * <HelmetProvider>
 *   <App />
 * </HelmetProvider>
 */

import { Helmet } from 'react-helmet-async';

export const MetaTags = ({ 
  title = 'Arte Gallera',
  description = 'Plataforma de apuestas en vivo de peleas de gallos',
  keywords = 'peleas de gallos, apuestas online, streaming en vivo',
  image = '/og-image.jpg',
  url = '',
  type = 'website'
}) => {
  const siteUrl = 'https://artegallera.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullTitle = title === 'Arte Gallera' ? title : `${title} | Arte Gallera`;
  
  return (
    <Helmet>
      {/* Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Arte Gallera" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

/**
 * Ejemplo de uso en una página:
 * 
 * import { MetaTags } from './components/SEO/MetaTags';
 * 
 * function EventosPage() {
 *   return (
 *     <>
 *       <MetaTags 
 *         title="Eventos en Vivo"
 *         description="Disfruta de los mejores eventos de peleas de gallos en tiempo real"
 *         keywords="eventos peleas gallos, transmisión en vivo, streaming gallos"
 *         url="/eventos"
 *         image="/images/eventos-og.jpg"
 *       />
 *       
 *       <div>
 *         <h1>Eventos en Vivo</h1>
 *         {/* Contenido de la página */}
 *       </div>
 *     </>
 *   );
 * }
 */

// Componente para datos estructurados (Schema.org)
export const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

/**
 * Ejemplo de Schema para la página principal:
 * 
 * const homeSchema = {
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   "name": "Arte Gallera",
 *   "url": "https://artegallera.com",
 *   "logo": "https://artegallera.com/logo.png",
 *   "description": "Plataforma de apuestas en vivo de peleas de gallos",
 *   "contactPoint": {
 *     "@type": "ContactPoint",
 *     "contactType": "customer service",
 *     "availableLanguage": ["Spanish"]
 *   }
 * };
 * 
 * <StructuredData data={homeSchema} />
 */

