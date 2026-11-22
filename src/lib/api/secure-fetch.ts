import { authClient } from "@/lib/auth-client";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

// ==========================================
// SECURE FETCH
// ==========================================
// Calls a protected Express API route.
// 1. Gets a JWT from Better Auth for the logged-in user
// 2. Sends it as "Authorization: Bearer <token>"
// 3. Throws an Error with the server message if the request fails
// Use only in client components ("use client").

export async function secureFetch<T = { message: string }>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please sign in first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${data.token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message ?? "Request failed.");
  }

  return result as T;
}
