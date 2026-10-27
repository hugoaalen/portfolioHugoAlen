import { getOptimizedImagePath } from "./public-assets.ts";

const visualIdentity: Record<string, { name: string; label: string; accent: string; format?: string }> = {
  futpath: { name: "FutPath", label: "FOOTBALL / PWA", accent: "#a6d486" },
  zaizen: { name: "ZaiZen", label: "PERSONAL FINANCE", accent: "#b6c6fd" },
  senda: { name: "Senda", label: "ACADEMIC PLANNER", accent: "#c3d8ad" },
  onosoalmanaque: { name: "oNoSoAlMaNaQuE", label: "COLLABORATIVE CALENDAR", accent: "#abc6ff", format: "legacy" },
  impostor: { name: "¿Quién finge?", label: "PARTY GAME", accent: "#ffa16f" },
  bpkeepers: { name: "BPKeepers", label: "GOALKEEPER COACHING", accent: "#7ecafa", format: "legacy" },
  taskflow: { name: "TaskFlow", label: "BACKEND / REST API", accent: "#b4aff1" },
  vehixhub: { name: "VehixHub", label: "VEHICLE INVENTORY / MVP", accent: "#b6c9de" },
  sfit: { name: "SFit", label: "WORKOUT TRACKER / PWA", accent: "#d0fa69" },
  padeltime: { name: "PadelTime", label: "PADEL / PROTOTYPE", accent: "#d5db8b", format: "phone" },
  mototv: { name: "Moto TV", label: "ANDROID TV / NATIVE", accent: "#88dddb", format: "tv" },
};

function escape(value: unknown): string {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

// Shared markup keeps static cards, Firestore cards and the animated deck identical.
export function renderProjectPreview(project: { id: string; image: string; title: { es: string; en?: string } }): string {
  const identity = visualIdentity[project.id];
  const src = getOptimizedImagePath(project.image);
  // Only old baked-in browser captures need the legacy crop; CMS replacements stay untouched.
  const format = identity?.format === "legacy" && !["/projects/bpkeepers-1200.jpg", "/projects/onosoalmanaque-1200.jpg"].includes(src)
    ? "desktop" : identity?.format || "desktop";
  return `<span class="project-preview" data-format="${format}" style="--preview-accent:${identity?.accent || "#a7bcd9"}">
    <span class="preview-heading"><span class="preview-name">${escape(identity?.name || project.title.es.split(" - ")[0])}</span><span class="preview-label">${escape(identity?.label || "PROJECT")}</span></span>
    <span class="preview-media"><span class="preview-window">
      <span class="preview-toolbar" aria-hidden="true"><span></span><span></span><span></span><i></i></span>
      <span class="preview-screen"><img src="${escape(src)}" alt="${escape(project.title.es)}" width="1440" height="900" loading="lazy" decoding="async" /></span>
    </span></span>
  </span>`;
}
