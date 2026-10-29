const organizations: Record<string, string> = {
  "grupo marsan": "grupo-marsan",
  "siscom software factory": "siscom",
  "cdec group": "cdec-group",
  "universitat oberta de catalunya (uoc)": "uoc",
  "ies anton losada dieguez": "ies-anton-losada-dieguez",
  "ies pazo da merce": "ies-pazo-da-merce",
  "colegio hogar afundacion": "colegio-hogar",
  "samsung dev spain": "samsung",
  "google": "google",
};

export function organizationLogo(company: string): string | undefined {
  const key = company.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  const name = Object.hasOwn(organizations, key) ? organizations[key] : undefined;
  const extension = name === "grupo-marsan" || name === "siscom" ? "svg" : "webp";
  return name ? `/images/organizations/${name}.${extension}` : undefined;
}

// The company name is already adjacent, so these logos are decorative.
export function renderOrganizationLogo(company: string): string {
  const src = organizationLogo(company);
  return src ? `<span class="organization-logo"><img src="${src}" alt="" width="64" height="56" loading="lazy" decoding="async"></span>` : "";
}
