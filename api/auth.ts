const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function login(email: string, password: string) {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/mobile-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.error || json?.message || "Login failed");
  }

  return json;
}
