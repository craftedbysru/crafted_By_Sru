/**
 * A simple email utility for local development.
 * In a real production environment, you would use a service like SendGrid, Mailgun, or AWS SES.
 */

export async function sendWelcomeEmail(email: string, name: string) {
  // For local development, we'll just log the email content to the console.
  // This simulates the email being sent.
  
  console.log("-----------------------------------------");
  console.log(`[EMAIL SENT] To: ${email}`);
  console.log(`Subject: Welcome to Crafted by Sru, ${name}!`);
  console.log("Content:");
  console.log(`Hello ${name},`);
  console.log("Thank you for joining Crafted by Sru. We're excited to have you as a member of our heritage community.");
  console.log("You can now browse our full catalog and manage your orders.");
  console.log("Happy shopping!");
  console.log("-----------------------------------------");

  // In a real implementation with Nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Crafted by Sru" <noreply@craftedbysru.com>',
    to: email,
    subject: `Welcome to Crafted by Sru, ${name}!`,
    text: `Hello ${name}, welcome to our community!`,
    html: `<b>Hello ${name}</b>, welcome to our community!`,
  });
  */

  return true;
}
