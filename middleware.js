export const config = {
  matcher: "/:path*",
};

// SHA-256 hash of the password — the real password is NOT stored here.
const PASSWORD_HASH =
  "8289be291cf584f8ce531e054bf35a2ca45074544254d72dfd24dee55dcd90e4";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default async function middleware(request) {
  const auth = request.headers.get("authorization");
  if (auth) {
    const decoded = atob(auth.split(" ")[1] || "");
    const pwd = decoded.slice(decoded.indexOf(":") + 1); // password part
    if ((await sha256(pwd)) === PASSWORD_HASH) return; // correct → let them in
  }
  return new Response("Authentication required.", {
    status: 401,
headers: { "WWW-Authenticate": 'Basic realm="SDR-ai", charset="UTF-8"' },
  });
}
