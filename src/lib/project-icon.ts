const paths: Record<string, string> = {
  factory: 'M3 21V10l6 3V8l6 3V3h4v18H3Zm4-4h1m4 0h1m4 0h1',
  chart: 'M4 3v17h17M8 15l4-5 4 2 5-7',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M13 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  check: 'M9 11l2 2 4-4M8 4H5v17h14V4h-3M8 2h8v4H8Z',
  sync: 'M20 7a8 8 0 0 0-14-2L3 8m0-5v5h5m-4 9a8 8 0 0 0 14 2l3-3m0 5v-5h-5',
  screen: 'M3 3h18v13H3ZM8 21h8m-4-5v5',
  code: 'M8 8l-4 4 4 4m8-8 4 4-4 4m-3-11-2 14',
  wallet: 'M3 6h17v15H3V6Zm0 0 14-3v3m-2 6h6v5h-6Z',
  calendar: 'M4 5h16v16H4ZM8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2',
};
const identities: Record<string, string> = {
  "marsan-mpms": "factory", "marsan-cotizador": "wallet", "marsan-bi": "chart",
  "marsan-mhrm": "people", "marsan-pacs": "check", "marsan-navsync": "sync",
  "marsan-presencia": "calendar", "marsan-planificador": "calendar",
  zaizen: "wallet", mototv: "screen", padeltime: "chart", onosoalmanaque: "calendar",
  futpath: "chart", senda: "check", sfit: "chart", impostor: "people", vehixhub: "screen",
};

export const projectLogos: Record<string, { file: string; format?: "svg"; monochrome?: boolean }> = {
  zaizen: { file: "zaizen" },
  futpath: { file: "futpath" },
  padeltime: { file: "padeltime" },
  mototv: { file: "mototv" },
  onosoalmanaque: { file: "onosoalmanaque" },
  senda: { file: "senda", format: "svg" },
  sfit: { file: "sfit", format: "svg" },
  impostor: { file: "impostor", format: "svg" },
  "marsan-mpms": { file: "mpms" },
  "marsan-mhrm": { file: "mhrm" },
  "marsan-cotizador": { file: "marsan-seal" },
  "marsan-pacs": { file: "marsan-seal" },
  "marsan-bi": { file: "marsan-vertical" },
  "marsan-planificador": { file: "marsan-vertical" },
  "marsan-navsync": { file: "marsan-horizontal", monochrome: true },
  "marsan-presencia": { file: "marsan-symbol" },
};

export function renderProjectIcon(id: string): string {
  const logo = projectLogos[id];
  if (logo) return `<span class="project-emblem project-logo${logo.monochrome ? " is-monochrome" : ""}" aria-hidden="true"><img src="/images/project-logos/${logo.file}.${logo.format || "webp"}" alt="" width="512" height="512" loading="lazy" decoding="async" /></span>`;
  const path = paths[identities[id] || "code"];
  return `<span class="project-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${path}" /></svg></span>`;
}
