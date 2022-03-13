import http from "http";

import {
  ouputNewIssueInfo,
  ouputPRIssueInfo,
  WebhookEvents,
} from "./webhook-events.js";

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

const webhookEvents = new WebhookEvents();

webhookEvents.on("issue-opened", (props) => {
  ouputNewIssueInfo(props);
});

webhookEvents.on("pr-opened", (props) => {
  ouputPRIssueInfo(props);
});

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
            const jsonData = JSON.parse(data);
            if (jsonData.issue && jsonData.action === "opened") {
              const props = {
                issueName: jsonData.issue.title,
                username: jsonData.issue.user.login,
                openIssueCount: jsonData.repository.open_issues_count,
              };
              webhookEvents.emit("issue-opened", props);
            } else if (jsonData.pull_request && jsonData.action === "opened") {
              const props = {
                pullRequestTitle: jsonData.pull_request.title,
                username: jsonData.pull_request.user.login,
              };
              webhookEvents.emit("pr-opened", props);
            }
          }
        });
        res.end();
      } else if (req.method === "GET") {
        res.write("Waiting for webhook events...");
        res.end();
      }
    }
  })
  .listen(3000);
