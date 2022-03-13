import EventEmitter from "events";
export class WebhookEvents extends EventEmitter {
  constructor(opts = {}) {
    super(opts);
    this.name = opts.name;
  }
}

export function ouputNewIssueInfo(props) {
  const message = `New issue opened: ${props.issueName}`;
  const openedBy = `Issue opened by ${props.username}.`;
  const newIssueCount = `Total open issues: ${props.openIssueCount}`;
  console.info(message);
  console.info(openedBy);
  console.info(newIssueCount);
}

export function ouputPRIssueInfo(props) {
  const message = `New pull request opened: ${props.pullRequestTitle}`;
  const openedBy = `Issue opened by ${props.username}.`;
  console.info(message);
  console.info(openedBy);
}
