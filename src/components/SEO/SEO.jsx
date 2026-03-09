import React, { useEffect } from "react";

const setMeta = (attr, key, value) => {
  if (!value) return;
  const selector = attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const setLink = (rel, href) => {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJSONLD = (obj) => {
  if (!obj) return;
  let el = document.head.querySelector('script[type="application/ld+json"][data-seo]');
  const json = JSON.stringify(obj, null, 2);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", "true");
    document.head.appendChild(el);
  }
  el.textContent = json;
};

export default function SEO({
  title = "Arte Gallera",
  description = "Arte Gallera: Apuestas de gallos en línea, disfruta de la emoción de las peleas de gallos en vivo.",
  url = "https://artegallera.com/",
  image = "https://artegallera.com/arte-gallera-logo.png",
  locale = "es_ES",
  type = "website",
  robots = "index, follow",
}) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    setLink("canonical", url);
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    // Open Graph
    setMeta("property", "og:locale", locale);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
  setMeta("property", "og:site_name", "Arte Gallera");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
    setMeta("property", "og:url", url);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:site", "@artegallera");

    // JSON-LD (Organization + WebSite)
    setJSONLD({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Arte Gallera",
          "url": url,
          "logo": image,
          "sameAs": [
            "https://facebook.com/your-page",
            "https://twitter.com/your-handle"
          ]
        },
        {
          "@type": "WebSite",
          "name": "Arte Gallera",
          "url": url
        }
      ]
    });

    return () => {
      // restore previous title
      document.title = previousTitle;
      // we intentionally do not remove metas (they act as defaults/global)
    };
  }, [title, description, url, image, locale, type, robots]);

  return null;
}
