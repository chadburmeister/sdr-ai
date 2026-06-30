export const config = {
  // run on every route
  matcher: "/:path*",
};

export default function middleware(request) {
  const PASS = process.env.SITE_PASSWORD;
  const USER = process.env.SITE_USER || "admin";

  // If no password is set, leave the site open.
  if (!PASS) return;

  const auth = request.headers.get("authorization");
  if (auth) {
    const [, encoded] = auth.split(" ");
    const decoded = atob(encoded);
    const idx = decoded.indexOf(":");
    const user = decoded.slice(0, idx);
    const pwd = decoded.slice(idx + 1);
    if (user === USER && pwd === PASS) return; // correct → allow through
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="SDR-ai — Private"' },
  });
}
