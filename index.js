import http from "http";

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.write("Hello World");
      res.end();
    }
  })
  .listen(3000);
