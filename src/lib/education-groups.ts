export function groupEducation<T extends { id?: string; order?: unknown }>(items: T[]) {
  // Older CMS records placed this formal qualification among short courses.
  const order = (item: T) => item.id === "cm-preimpresion-digital" ? 40 : Number(item.order ?? 0);
  const sorted = [...items].sort((a, b) => order(a) - order(b));
  return {
    primary: sorted.filter((item) => order(item) < 100),
    additional: sorted.filter((item) => order(item) >= 100),
  };
}
