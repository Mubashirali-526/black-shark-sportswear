// Custom entry point for cPanel's Node.js Selector (Phusion Passenger),
// which runs `node server.js` directly and expects it to listen on the
// port it assigns via PORT — `next start` alone isn't invoked by Passenger.
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});
