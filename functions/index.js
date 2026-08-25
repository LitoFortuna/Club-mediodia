import { onRequest } from "firebase-functions/v2/https";

let ssrHandler;

export const ssr_server = onRequest({ 
  region: "us-central1",
  memory: "512MiB",
  maxInstances: 10,
}, async (req, res) => {
  if (!ssrHandler) {
    const mod = await import("./dist/server.js");
    ssrHandler = mod.default;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const url = new URL(req.url, `${protocol}://${host}`).toString();
  
  // Create a Web Request from the Node.js request
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.rawBody && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) 
      ? req.rawBody 
      : undefined,
  });

  try {
    const response = await ssrHandler.fetch(request);
    
    // Copy response headers to Node.js response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);
    
    // Handle streaming response
    if (response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    }
    res.end();
  } catch (error) {
    console.error("SSR Error:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    } else {
      res.end();
    }
  }
});
