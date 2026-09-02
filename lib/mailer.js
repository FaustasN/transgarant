import "server-only";

import nodemailer from "nodemailer";

const requiredEnvironmentVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_TO",
];

let transporter;

function getMailConfig() {
  const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
  );

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing mail environment variables: ${missingEnvironmentVariables.join(", ")}`,
    );
  }

  const port = Number(process.env.SMTP_PORT);
  const secureValue = process.env.SMTP_SECURE.toLowerCase();

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  if (secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be either true or false.");
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: secureValue === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.MAIL_TO,
  };
}

function getTransporter(config) {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return transporter;
}

export async function sendMail({
  subject,
  text,
  html,
  replyTo,
  attachments,
}) {
  if (!subject) {
    throw new Error("An email subject is required.");
  }

  if (!text && !html) {
    throw new Error("Email text or HTML content is required.");
  }

  const config = getMailConfig();

  return getTransporter(config).sendMail({
    from: config.user,
    to: config.to,
    subject,
    text,
    html,
    replyTo,
    attachments,
  });
}
