import { defineMiddleware } from "astro:middleware";
import { getMaintenanceEnabled } from "./lib/site-availability";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV || !["/", "/index.html", "/maintenance", "/maintenance/"].includes(context.url.pathname)) return next();
  let enabled = true;
  try {
    enabled = await getMaintenanceEnabled(import.meta.env.PUBLIC_FIREBASE_PROJECT_ID, import.meta.env.PUBLIC_FIREBASE_API_KEY);
  } catch {
    console.error("No se pudo verificar la disponibilidad del portfolio.");
  }
  const isMaintenance = context.url.pathname.startsWith("/maintenance");
  if (enabled && !isMaintenance) return context.redirect("/maintenance", 307);
  if (!enabled && isMaintenance) return context.redirect("/", 307);
  return next();
});
