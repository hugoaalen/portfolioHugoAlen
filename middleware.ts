import { availabilityResponse, getMaintenanceEnabled } from "./src/lib/site-availability.ts";

export const config = { matcher: ["/", "/index.html", "/maintenance", "/maintenance/"] };

export default async function middleware(request: Request) {
  let maintenance = true;
  try {
    maintenance = await getMaintenanceEnabled(process.env.PUBLIC_FIREBASE_PROJECT_ID, process.env.PUBLIC_FIREBASE_API_KEY);
  } catch (error) {
    // Never reveal the portfolio when the visibility setting cannot be verified.
    console.error("Could not verify portfolio availability", error instanceof Error ? error.message : "Unknown error");
  }
  return availabilityResponse(request, maintenance);
}
