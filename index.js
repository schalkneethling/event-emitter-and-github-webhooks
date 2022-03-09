import http from "http";

import { WebhookEvents } from "./webhook-events.js";

/**
 * Listens for the `data` events on the request as chunks of data arrivesdata once
 * and returns the accumulated data once the `end` event is been fired.
 * @param {object} req - The request object
 * @returns The body of the POST request. In this case it will be JSON
 */
function getData(req) {
  let body = "";
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });
  });
}

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.write("Hello World");
      res.end();
    } else if (req.url === "/payload") {
      if (req.method === "POST") {
        // req is now itself an EventEmitter emitting `data` events
        // as data arrives and an `end` event when all data has arrived
        getData(req).then((data) => {
          if (data) {
            const webhookEvents = new WebhookEvents();

            if (data.issue && data.action === "opened") {
              webhookEvents.emit("issue-opened", data);
            }
          }
        });
      }
      res.write("Hello payload");
      res.end();
    }
  })
  .listen(3000);
