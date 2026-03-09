import React from "react";
import SEO from "./SEO";

const humanizePath = (path) => {
  if (!path || path === "/") return "Inicio";
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function RouteWithMeta({ Component, meta }) {
  // Component is a React component (not JSX)
  const Comp = Component;

  // Build sensible defaults if meta is not provided
  let computedMeta = meta;
  if (!computedMeta) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    const name = humanizePath(pathname);
    computedMeta = {
      title: `Arte Gallera — ${name}`,
      description: `Sección ${name} en Arte Gallera. Accede a contenido y funcionalidades relacionadas con ${name.toLowerCase()}.`,
      image: "https://artegallera.com/arte-gallera-logo.png",
      url: `https://artegallera.com${pathname}`,
    };
  }

  return (
    <>
      <SEO
        title={computedMeta.title}
        description={computedMeta.description}
        url={computedMeta.url}
        image={computedMeta.image}
      />
      <Comp />
    </>
  );
}
