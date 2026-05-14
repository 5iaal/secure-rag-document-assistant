import { apiRequest, setToken, clearToken } from "./client";

export async function loginUser(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(data.access_token);
  localStorage.setItem("user_role", data.role);
  localStorage.setItem("user_id", data.user_id);

  return data;
}

export async function registerUser(fullName, email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
    }),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function logoutUser() {
  clearToken();
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_id");
}