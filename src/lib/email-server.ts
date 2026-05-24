import prisma from "@/lib/prisma";
import { EMAIL_TEMPLATES } from "./email-templates";
import { sendEmail } from "./email";

async function getTemplate(type: string, data: any) {
  try {
    const dbTemplate = await prisma.emailTemplate.findUnique({
      where: { type }
    });
    
    if (dbTemplate) {
      let html = dbTemplate.body;
      let subject = dbTemplate.subject;
      
      // Basic variable replacement
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, data[key]);
        subject = subject.replace(regex, data[key]);
      });
      
      return { subject, html };
    }
  } catch (e) {
    console.error(`Error fetching template ${type} from DB`, e);
  }
  return null;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dynamic = await getTemplate("welcome", { name });
  const { subject, html } = dynamic || EMAIL_TEMPLATES.welcome(name);
  return sendEmail({ to: email, subject, html, type: "WELCOME" });
}

export async function sendOrderConfirmationEmail(email: string, orderId: string, total: number, items: any[], address: any, currency: string = "INR") {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";
  const tableRows = `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #451a0320;">
          <th style="text-align: left; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360;">Item Details</th>
          <th style="text-align: center; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360; width: 40px;">Qty</th>
          <th style="text-align: right; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360; width: 90px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr style="border-bottom: 1px solid #451a0308;">
            <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #451a03;">${item.name}</td>
            <td style="padding: 10px 0; font-size: 13px; text-align: center; color: #451a03b0;">${item.quantity}</td>
            <td style="padding: 10px 0; font-size: 13px; text-align: right; font-weight: bold; color: #451a03;">${symbol}${((item.priceInSelectedCurrency || item.price) * item.quantity).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  const dynamic = await getTemplate("orderConfirmation", { 
    orderId: orderId.toUpperCase(), 
    total: total.toLocaleString(),
    userName: address.firstName || 'Patron',
    itemsTable: tableRows,
    currencySymbol: symbol
  });
  
  const { subject, html } = dynamic || (EMAIL_TEMPLATES as any).orderConfirmation(orderId, total, items, address, currency);
  return sendEmail({ to: email, subject, html, type: "ORDER_CONFIRMATION" });
}

export async function sendPasswordResetEmail(email: string, token: string, origin?: string) {
  const host = (origin || process.env.NEXTAUTH_URL || "https://craftedbysru.in").replace(/\/+$/, "");
  const resetLink = `${host}/auth/reset-password?token=${token}`;
  const dynamic = await getTemplate("passwordReset", { resetLink });
  const { subject, html } = dynamic || EMAIL_TEMPLATES.passwordReset(resetLink);
  return sendEmail({ to: email, subject, html, type: "PASSWORD_RESET" });
}

export async function sendOtpEmail(email: string, otp: string) {
  const dynamic = await getTemplate("otp", { otp });
  const { subject, html } = dynamic || EMAIL_TEMPLATES.otp(otp);
  return sendEmail({ to: email, subject, html, type: "VERIFICATION_OTP" });
}

export function getOrderConfirmationTemplate(orderId: string, total: number, items: any[] = [], address: any = {}) {
  return (EMAIL_TEMPLATES as any).orderConfirmation(orderId, total, items, address).html;
}
