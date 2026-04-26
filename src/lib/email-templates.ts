export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: `Welcome to Crafted by Sru, ${name}`,
    html: `<div style="font-family: serif; color: #451a03; padding: 20px;"><h1>Welcome, ${name}!</h1><p>Thank you for joining our heritage community. We are honored to share our authentic artistry with you.</p></div>`
  }),
  orderConfirmation: (orderId: string, total: number, items: any[] = [], address: any = {}) => ({
    subject: `Selection Confirmed - Order #${orderId.toUpperCase()}`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #451a0310; pb-20px; margin-bottom: 30px;">Order Confirmed</h1>
        <p>Dear ${address.firstName || 'Patron'},</p>
        <p>Your order <strong>#${orderId.toUpperCase()}</strong> has been received and is being prepared with artisanal care.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: white; border: 1px solid #451a0310;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360; margin-bottom: 15px;">Your Selection</h2>
          ${Array.isArray(items) ? items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span>${item.name} x ${item.quantity}</span>
              <span>₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('') : ''}
          <div style="border-top: 1px solid #451a0310; margin-top: 15px; pt-15px; font-weight: bold; display: flex; justify-content: space-between;">
            <span>Total Amount</span>
            <span>₹${total.toLocaleString()}</span>
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          Our artisans are now beginning to curate your selection. You will receive a tracking link once your heritage treasures are on their way.
        </p>
        
        <p style="font-size: 12px; color: #451a0360; margin-top: 40px; border-top: 1px solid #451a0310; pt-20px;">
          Crafted by Sru | Honoring Indian Traditions
        </p>
      </div>
    `
  }),
  passwordReset: (resetToken: string) => ({
    subject: `Reset Your Crafted by Sru Password`,
    html: `<div style="font-family: serif; color: #451a03; padding: 20px;"><h1>Security Request</h1><p>Please use the link below to reset your password.</p><p><a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}">Reset Password</a></p></div>`
  })
};
