import nodemailer from 'nodemailer';

let transporterPromise = null;

async function createTransporter() {
  if (transporterPromise) return transporterPromise;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    transporterPromise = Promise.resolve(nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465,
      auth: { user, pass }
    }));
    return transporterPromise;
  }

  // Fallback to Ethereal test account when SMTP not provided
  transporterPromise = (async () => {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
  })();

  return transporterPromise;
}

export async function sendMail({ to, subject, text, html, from }) {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: from || process.env.FROM_EMAIL || 'no-reply@example.com',
    to,
    subject,
    text,
    html
  });

  // If using Ethereal, return preview URL
  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info) || null
  };
}

export default { sendMail };
