import { toast } from "sonner";

import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      resendClient = new Resend(key);
    }
  }
  return resendClient;
}

/**
 * EMAIL SERVICE
 * Uses Resend in production if RESEND_API_KEY is provided.
 * Falls back to simulation/logging for development or if key is missing.
 */

export async function sendEmail({ to, subject, html, type }: { to: string, subject: string, html: string, type: string }) {
  console.log(`[EMAIL DISPATCH] To: ${to}, Subject: ${subject}, Type: ${type}`);
  
  // Persist to a local storage log for merchant review (Client side only)
  if (typeof window !== "undefined") {
    try {
      const logs = JSON.parse(localStorage.getItem("sru_email_logs") || "[]");
      logs.unshift({
        id: Date.now().toString(),
        to,
        subject,
        html,
        type,
        sentAt: new Date().toISOString()
      });
      localStorage.setItem("sru_email_logs", JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.warn("Could not save local email log", e);
    }
  }

  // Real dispatch via Resend (Server side only)
  const resend = getResend();
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: "Crafted by Sru <concierge@craftedbysru.com>",
        to,
        subject,
        html,
      });
      if (error) {
        console.error("Resend error:", error);
        return { success: false, error };
      }
      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error("Resend execution failed:", err);
      return { success: false, error: err };
    }
  }

  // Simulate network delay if no real client
  await new Promise(r => setTimeout(r, 800));
  
  return { success: true, messageId: Math.random().toString(36).substring(7) };
}

export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: `Welcome to Sree Rama Utsav, ${name}`,
    html: `<div style="font-family: serif; color: #451a03; padding: 20px;"><h1>Welcome, ${name}!</h1><p>Thank you for joining our heritage community. We are honored to share our authentic artistry with you.</p></div>`
  }),
  orderConfirmation: (orderId: string, total: number) => ({
    subject: `Selection Confirmed - Order #${orderId.toUpperCase()}`,
    html: `<div style="font-family: serif; color: #451a03; padding: 20px;"><h1>Order Confirmed</h1><p>Your order #${orderId.toUpperCase()} has been received and is being prepared with artisanal care.</p><p>Total Amount: ₹${total.toLocaleString()}</p></div>`
  }),
  passwordReset: (resetToken: string) => ({
    subject: `Reset Your Sree Rama Utsav Password`,
    html: `<div style="font-family: serif; color: #451a03; padding: 20px;"><h1>Security Request</h1><p>Please use the link below to reset your password.</p><p><a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}">Reset Password</a></p></div>`
  })
};

export async function sendWelcomeEmail(email: string, name: string) {
  const { subject, html } = EMAIL_TEMPLATES.welcome(name);
  return sendEmail({ to: email, subject, html, type: "WELCOME" });
}

export async function sendOrderConfirmationEmail(email: string, orderId: string, total: number) {
  const { subject, html } = EMAIL_TEMPLATES.orderConfirmation(orderId, total);
  return sendEmail({ to: email, subject, html, type: "ORDER_CONFIRMATION" });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const { subject, html } = EMAIL_TEMPLATES.passwordReset(token);
  return sendEmail({ to: email, subject, html, type: "PASSWORD_RESET" });
}

export function getOrderConfirmationTemplate(orderId: string, total: number) {
  return EMAIL_TEMPLATES.orderConfirmation(orderId, total).html;
}
