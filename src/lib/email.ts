
let resendClient: any = null;

async function getResend() {
  if (typeof window !== "undefined") return null;
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        const { Resend } = await import("resend");
        resendClient = new Resend(key);
      } catch (e) {
        console.error("Could not load resend module", e);
      }
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
  const resend = await getResend();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "concierge@craftedbysru.in";
      const fromName = process.env.RESEND_FROM_NAME || "Crafted by Sru";
      
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
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

// Re-export templates for convenience, but from the templates file
export { EMAIL_TEMPLATES } from "./email-templates";
