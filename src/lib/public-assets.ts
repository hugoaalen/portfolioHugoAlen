const optimizedImages: Record<string, string> = {
  "/yo.jpg": "/yo-256.jpg",
  "/projects/zaizen.png": "/projects/zaizen-capture.jpg",
  "/projects/zaizen-1200.jpg": "/projects/zaizen-capture.jpg",
  "/projects/senda-window.png": "/projects/senda-capture.jpg",
  "/projects/senda-window-1200.jpg": "/projects/senda-capture.jpg",
  "/projects/impostor-window.png": "/projects/impostor-capture.jpg",
  "/projects/impostor-window-1200.jpg": "/projects/impostor-capture.jpg",
  "/projects/futpath.svg": "/projects/futpath-capture.jpg",
  "/projects/taskflow.svg": "/projects/taskflow-cover.svg",
  "/projects/vehixhub.svg": "/projects/vehixhub-cover.svg",
  "/projects/bpkeepers.webp": "/projects/bpkeepers-1200.jpg",
  "/projects/onosoalmanaque.webp": "/projects/onosoalmanaque-1200.jpg",
};

export function getOptimizedImagePath(path: unknown): string {
  if (typeof path !== "string") return "";
  return optimizedImages[path] ?? path;
}
