"use server";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://petstore.swagger.io/v2";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
  tags?: string[]
): Promise<T | undefined> {
  const { method = "GET", headers = {}, body } = options;

  const isFormData =
    (headers as any)["Content-Type"] === "application/x-www-form-urlencoded";

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: {
      tags,
    },
    method,
    headers: {
      ...headers,
    },
    body: isFormData
      ? new URLSearchParams(body).toString()
      : body
      ? JSON.stringify(body)
      : undefined,
    cache: "no-store", //alwasy fresh data
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();
    console.error(errorText, res.status, "error in apiFetch");
    return;
  }

  return contentType?.includes("application/json")
    ? res.json()
    : ((await res.text()) as any);
}
