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

export async function sendOrderConfirmationEmail(email: string, orderId: string, total: number, items: any[], address: any) {
  const tableRows = items.map(item => `
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
      <span>${item.name} x ${item.quantity}</span>
      <span>₹${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');
  
  const dynamic = await getTemplate("orderConfirmation", { 
    orderId: orderId.toUpperCase(), 
    total: total.toLocaleString(),
    userName: address.firstName || 'Patron',
    itemsTable: tableRows
  });
  
  const { subject, html } = dynamic || (EMAIL_TEMPLATES as any).orderConfirmation(orderId, total, items, address);
  return sendEmail({ to: email, subject, html, type: "ORDER_CONFIRMATION" });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const dynamic = await getTemplate("passwordReset", { resetLink });
  const { subject, html } = dynamic || EMAIL_TEMPLATES.passwordReset(token);
  return sendEmail({ to: email, subject, html, type: "PASSWORD_RESET" });
}

export function getOrderConfirmationTemplate(orderId: string, total: number, items: any[] = [], address: any = {}) {
  return (EMAIL_TEMPLATES as any).orderConfirmation(orderId, total, items, address).html;
}
