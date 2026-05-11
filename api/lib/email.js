export async function sendVerificationEmail(toEmail, verifyUrl) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV] Verification link for ${toEmail}: ${verifyUrl}`);
    return;
  }

  if (!process.env.SMTP_HOST) {
    console.warn(`[WARN] Email not delivered to ${toEmail} — SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM in .env.`);
    console.warn(`[WARN] Verification URL: ${verifyUrl}`);
    return;
  }

  // Install nodemailer and uncomment to enable SMTP delivery:
  // const nodemailer = (await import('nodemailer')).default;
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT) || 587,
  //   secure: process.env.SMTP_SECURE === 'true',
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  // });
  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM || 'noreply@statia-luxury.com',
  //   to: toEmail,
  //   subject: 'Verify your Statia account',
  //   html: `<p>Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  // });
}
