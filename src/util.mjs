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

export async function wrapTimer(executable, ...args) {
  const startTime = new Date();

  const result = await executable(...args);

  console.log(
    `Function: ${executable.name} | Time: ${new Date() - startTime}ms`
  );
  return result;
}
