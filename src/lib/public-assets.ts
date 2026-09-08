const optimizedImages: Record<string, string> = {
  "/yo.jpg": "/yo-256.jpg",
  "/projects/zaizen.png": "/projects/zaizen-1200.jpg",
  "/projects/senda-window.png": "/projects/senda-window-1200.jpg",
  "/projects/impostor-window.png": "/projects/impostor-window-1200.jpg",
  "/projects/bpkeepers.webp": "/projects/bpkeepers-1200.jpg",
  "/projects/onosoalmanaque.webp": "/projects/onosoalmanaque-1200.jpg",
};

export function getOptimizedImagePath(path: unknown): string {
  if (typeof path !== "string") return "";
  return optimizedImages[path] ?? path;
}
