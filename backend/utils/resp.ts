export function resp(
  body: unknown,
  statusCode: number = 200,
  headers: Record<string, string | number> = {}
) {
  return {
    body: typeof body === "string" ? body : JSON.stringify(body),
    statusCode,
    headers,
  };
}
