// Base API client to communicate with the Lavish Lathers backend server

const BASE_URL = import.meta.env.VITE_API_URL;
// const BASE_URL =
//   import.meta.env.VITE_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("lavish_lathers_admin_token");

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("lavish_lathers_admin_token");

    window.location.replace("/admin/login");

    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let errorMsg = "An error occurred during the API call";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch {
      // Intentionally empty, fallback on status code
      errorMsg = `API responded with status code ${response.status}`;
    }
    throw new Error(errorMsg);
  }

  // Handle successful empty response (e.g., 204 or DELETE)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
