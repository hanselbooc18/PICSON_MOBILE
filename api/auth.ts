import { apiRequest, setAccessToken } from "@/api/client";

export type MobileUser = {
  id: number | string;
  name?: string;
  email?: string;
  roles_id?: number;
  role?: string;
  roles?: {
    roles_id?: number;
    role?: string;
  } | null;
};

type LoginResponse = {
  message: string;
  token_type: "Bearer";
  access_token: string;
  user: MobileUser;
};

export async function login(email: string, password: string) {
  const json = await apiRequest<LoginResponse>("/api/mobile-login", {
    method: "POST",
    body: {
      email,
      password,
      device_name: "PICSON Mobile",
    },
  });

  setAccessToken(json.access_token);

  return json;
}

export function getUserRole(user?: MobileUser | null) {
  return user?.roles?.role || user?.role || "";
}

export function isAdminUser(user?: MobileUser | null) {
  return getUserRole(user).toLowerCase() === "admin";
}

export async function getCurrentUser() {
  return apiRequest<MobileUser>("/api/user");
}

export async function logout() {
  await apiRequest<{ message: string }>("/api/logout", {
    method: "POST",
  });

  setAccessToken(null);
}
