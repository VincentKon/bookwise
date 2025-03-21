import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";
import { Client as QstashClient, resend } from "@upstash/qstash";
import { Html } from "next/document";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QstashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      // Need to get premium email from domain, and renew domain name (cannot subdomain)
      from: "Vincent <hello.vincentkon.tech>",
      to: [email],
      subject,
      Html: message,
    },
  });
};
