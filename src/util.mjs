const allowedCorsHeaders = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

export function getResponse(statusCode, body) {
  return {
    statusCode,
    headers: allowedCorsHeaders,
    body: JSON.stringify(body),
  };
}
