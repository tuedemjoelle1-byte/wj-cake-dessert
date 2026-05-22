export function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer"
  });
  res.end(JSON.stringify(payload, null, 2));
}

export function ok(res, payload, status = 200) {
  sendJson(res, status, payload);
}

export function fail(res, status, code, message, details) {
  sendJson(res, status, {
    error: {
      code,
      message,
      details: details || null
    }
  });
}
