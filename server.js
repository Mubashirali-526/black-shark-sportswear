// Custom entry point for cPanel's Node.js Selector (Phusion Passenger).
// Passenger runs `node server.js` directly and expects the app to listen
// on the port it assigns via the PORT env var — `next start` alone won't
// work under Passenger since Passenger doesn't invoke npm scripts here.
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});
