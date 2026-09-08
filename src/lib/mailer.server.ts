// Envío de emails por SMTP — SOLO servidor
// Usamos createRequire para importar nodemailer como CJS, igual que con
// firebase-admin, y evitar problemas de interop en el bundle SSR.
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _transporter: any;

function getTransporter() {
  if (_transporter) return _transporter;

  const nodemailer = require("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 465);

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true = SSL directo (465), false = STARTTLS (587)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return _transporter;
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  cid: string;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "Faltan variables SMTP_HOST / SMTP_USER / SMTP_PASS en el entorno del servidor.",
    );
  }

  const from = process.env.SMTP_FROM || `"Club Mediodía" <${process.env.SMTP_USER}>`;
  const transporter = getTransporter();

  return transporter.sendMail({
    from,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    attachments: opts.attachments,
  });
}
