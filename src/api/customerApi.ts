export interface SavedCheckout {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Customer {
  email: string;
  savedCheckout: SavedCheckout | null;
}

// Production uses the storefront's /api proxy so the session is a first-party cookie.
export const customerApiBase = import.meta.env.VITE_CUSTOMER_API_URL || (import.meta.env.DEV ? import.meta.env.VITE_API_URL || "/api" : "/api");

export async function customerRequest<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(customerApiBase + path, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    cache: "no-store",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => { throw new Error("Unable to reach the account service."); });
  if (!response.ok) {
    throw Object.assign(new Error(data?.message || "Unable to reach the account service. Please try again."), {
      retryAfter: data?.retryAfter, status: response.status,
    });
  }
  return data;
}
