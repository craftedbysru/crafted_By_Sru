export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: `Welcome to Crafted by Sru, ${name}`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320;">
        <h1 style="font-size: 28px; margin-bottom: 20px;">Welcome to the Family, ${name}</h1>
        <p>Thank you for joining our heritage community. At Crafted by Sru, we are honored to share our authentic artistry with you.</p>
        <p>Your account has been successfully created. You can now explore our curated collections and track your selections.</p>
        <div style="margin-top: 30px; border-top: 1px solid #451a0310; pt-20px;">
          <p style="font-size: 12px; color: #451a0360;">Crafted by Sru | Honoring Indian Traditions</p>
        </div>
      </div>
    `
  }),
  orderConfirmation: (orderId: string, total: number, items: any[] = [], address: any = {}, currency: string = "INR") => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";
    return {
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
                <span>${symbol}${((item.priceInSelectedCurrency || item.price) * item.quantity).toLocaleString()}</span>
              </div>
            `).join('') : ''}
            <div style="border-top: 1px solid #451a0310; margin-top: 15px; pt-15px; font-weight: bold; display: flex; justify-content: space-between;">
              <span>Total Amount</span>
              <span>${symbol}${total.toLocaleString()}</span>
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
    };
  },
  passwordReset: (resetToken: string) => ({
    subject: `Reset Your Crafted by Sru Password`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Security Request</h1>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>Please click the button below to safely reset your password. This link will expire in 1 hour.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}" style="background-color: #451a03; color: white; padding: 15px 30px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #451a0360; margin-top: 40px; border-top: 1px solid #451a0310; pt-20px;">
          Crafted by Sru | Security Center
        </p>
      </div>
    `
  }),
  forgotPassword: (resetToken: string) => ({
    subject: `Forgot your password?`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Password Recovery</h1>
        <p>It happens to the best of us. Let's get you back into your account.</p>
        <p>Click the link below to set a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}" style="background-color: #451a03; color: white; padding: 15px 30px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Set New Password</a>
        </div>
        <p style="font-size: 12px; color: #451a0360;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 10px; color: #451a0340; margin-top: 20px;">Valid for 60 minutes only.</p>
      </div>
    `
  })
};
