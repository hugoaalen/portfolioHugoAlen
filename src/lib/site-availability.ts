// Keep the existing public document so deployed Firestore rules remain compatible.
export const availabilityDocument = ["content", "profile"] as const;

export function readMaintenanceFlag(document: unknown): boolean {
  const value = (document as { fields?: { maintenanceEnabled?: { booleanValue?: unknown } } })
    ?.fields?.maintenanceEnabled?.booleanValue;
  if (value === undefined) return false;
  if (typeof value !== "boolean") throw new Error("Invalid maintenance setting");
  return value;
}

export async function getMaintenanceEnabled(
  projectId: string | undefined,
  apiKey: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  if (!projectId || !apiKey) throw new Error("Firebase availability configuration missing");
  const url = new URL(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${availabilityDocument.join("/")}`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("mask.fieldPaths", "maintenanceEnabled");
  const response = await fetcher(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Availability read failed (${response.status})`);
  return readMaintenanceFlag(await response.json());
}

export function availabilityResponse(request: Request, maintenance: boolean): Response {
  const url = new URL(request.url);
  const isMaintenancePage = url.pathname.replace(/\/$/, "") === "/maintenance";
  if (maintenance && !isMaintenancePage) {
    return new Response(null, { status: 307, headers: { Location: new URL("/maintenance", url).href, "Cache-Control": "no-store" } });
  }
  if (!maintenance && isMaintenancePage) {
    return new Response(null, { status: 307, headers: { Location: new URL("/", url).href, "Cache-Control": "no-store" } });
  }
  return new Response(null, { headers: { "x-middleware-next": "1", "Cache-Control": "no-store" } });
}
