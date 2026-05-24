export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: `Welcome to Crafted by Sru, ${name}`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320; box-sizing: border-box;">
        <h1 style="font-size: 28px; margin-bottom: 20px; font-family: serif; color: #451a03;">Welcome to the Family, ${name}</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Thank you for joining our heritage community. At Crafted by Sru, we are honored to share our authentic artistry with you.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Your account has been successfully created. You can now explore our curated collections and track your selections.</p>
        <div style="margin-top: 30px; border-top: 1px solid #451a0310; padding-top: 20px;">
          <p style="font-size: 12px; color: #451a0360;">Crafted by Sru | Honoring Indian Traditions</p>
          <p style="font-size: 10px; color: #451a0340; margin-top: 15px; border-top: 1px dashed #451a0310; padding-top: 10px; text-align: center; font-style: italic;">
            This is an automated system email. Please do not reply to this mail id.
          </p>
        </div>
      </div>
    `
  }),

  orderConfirmation: (orderId: string, total: number, items: any[] = [], address: any = {}, currency: string = "INR") => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";
    return {
      subject: `Selection Confirmed - Order #${orderId.toUpperCase()}`,
      html: `
        <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320; box-sizing: border-box;">
          <h1 style="font-size: 24px; border-bottom: 2px solid #451a0310; padding-bottom: 15px; margin-bottom: 25px; color: #451a03;">Order Confirmed</h1>
          <p style="font-size: 14px; color: #451a03;">Dear ${address.firstName || 'Patron'},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Your order <strong style="color: #451a03;">#${orderId.toUpperCase()}</strong> has been successfully received and is being prepared with professional artisanal care.</p>
          
          <div style="margin: 30px 0; padding: 25px; background: white; border: 1px solid #451a0310; box-shadow: 0 1px 3px rgba(69,26,3,0.05);">
            <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #451a0380; margin: 0 0 15px 0; border-bottom: 1px solid #451a0310; padding-bottom: 8px;">Your Selection</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="border-bottom: 1.5px solid #451a0320;">
                  <th style="text-align: left; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360;">Item Details</th>
                  <th style="text-align: center; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360; width: 40px;">Qty</th>
                  <th style="text-align: right; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #451a0360; width: 90px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${Array.isArray(items) ? items.map(item => `
                  <tr style="border-bottom: 1px solid #451a0308;">
                    <td style="padding: 12px 0; font-size: 13px; font-weight: bold; color: #451a03;">${item.name}</td>
                    <td style="padding: 12px 0; font-size: 13px; text-align: center; color: #451a03a0;">${item.quantity}</td>
                    <td style="padding: 12px 0; font-size: 13px; text-align: right; font-weight: bold; color: #451a03;">${symbol}${((item.priceInSelectedCurrency || item.price) * item.quantity).toLocaleString()}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
            
            <table style="width: 100%; margin-top: 15px; border-top: 1.5px solid #451a0310; padding-top: 15px; font-family: sans-serif; font-size: 12px; color: #451a03;">
              <tr>
                <td style="width: 40%;"></td>
                <td style="width: 60%;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 4px 0; color: #451a0380;">Subtotal</td>
                      <td style="padding: 4px 0; text-align: right; font-weight: 550;">${symbol}${total.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #451a0380;">Shipping & Handling</td>
                      <td style="padding: 4px 0; text-align: right; font-style: italic; color: #16a34a; font-weight: bold;">FREE</td>
                    </tr>
                    <tr style="border-top: 1.5px solid #451a0320;">
                      <td style="padding: 10px 0 0 0; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #451a03;">Total Paid</td>
                      <td style="padding: 10px 0 0 0; text-align: right; font-weight: bold; font-size: 15px; color: #451a03;">${symbol}${total.toLocaleString()}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #451a03b0; margin-bottom: 25px;">
            Our artisans are now beginning to curate your selection of fine return gifts. You will automatically receive an update and a tracking link once your heritage packages are on their way.
          </p>
          
          <div style="margin-top: 40px; border-top: 1px solid #451a0310; padding-top: 20px;">
            <p style="font-size: 12px; color: #451a0360; margin: 0 0 10px 0;">Crafted by Sru | Honoring Indian Traditions</p>
            <p style="font-size: 10px; color: #451a0340; margin-top: 15px; border-top: 1px dashed #451a0310; padding-top: 10px; text-align: center; font-style: italic;">
              This is an automated system email. Please do not reply to this mail id.
            </p>
          </div>
        </div>
      `
    };
  },

  passwordReset: (resetLink: string) => ({
    subject: `Reset Your Crafted by Sru Password`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320; box-sizing: border-box;">
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #451a03;">Security Request</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Please click the button below to safely reset your password. This link will expire in 1 hour.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #451a03; color: white; padding: 15px 30px; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold; border-radius: 2px; display: inline-block;">Reset Password</a>
        </div>
        <div style="margin-top: 40px; border-top: 1px solid #451a0310; padding-top: 20px;">
          <p style="font-size: 12px; color: #451a0360;">Crafted by Sru | Security Center</p>
          <p style="font-size: 10px; color: #451a0340; margin-top: 15px; border-top: 1px dashed #451a0310; padding-top: 10px; text-align: center; font-style: italic;">
            This is an automated system email. Please do not reply to this mail id.
          </p>
        </div>
      </div>
    `
  }),

  forgotPassword: (resetLink: string) => ({
    subject: `Forgot your password?`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320; box-sizing: border-box;">
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #451a03;">Password Recovery</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">It happens to the best of us. Let's get you back into your account.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Click the link below to set a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #451a03; color: white; padding: 15px 30px; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold; border-radius: 2px; display: inline-block;">Set New Password</a>
        </div>
        <p style="font-size: 12px; color: #451a0360; text-align: center;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 10px; color: #451a0340; text-align: center; margin-top: 10px;">Valid for 60 minutes only.</p>
        <div style="margin-top: 40px; border-top: 1px solid #451a0310; padding-top: 20px;">
          <p style="font-size: 10px; color: #451a0340; text-align: center; font-style: italic;">
            This is an automated system email. Please do not reply to this mail id.
          </p>
        </div>
      </div>
    `
  }),

  otp: (otp: string) => ({
    subject: `Your Verification Code - Crafted by Sru`,
    html: `
      <div style="font-family: serif; color: #451a03; padding: 40px; background-color: #fdf8f3; max-width: 600px; margin: 0 auto; border: 1px solid #451a0320; box-sizing: border-box;">
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #451a03;">Email Verification</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #451a03d0;">Thank you for initiating your signup with Crafted by Sru. To complete your account creation, please verify your email address with the verification code below:</p>
        <div style="margin: 30px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #451a03; background-color: #451a0310; padding: 15px 30px; border-radius: 4px; display: inline-block; border: 1px dashed #451a0340;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #451a0360; text-align: center;">This verification code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p style="font-size: 10px; color: #451a0340; text-align: center; margin-top: 15px;">Please do not share this code with anyone.</p>
        <div style="margin-top: 40px; border-top: 1px solid #451a0310; padding-top: 20px;">
          <p style="font-size: 10px; color: #451a0340; text-align: center; font-style: italic;">
            This is an automated system email. Please do not reply to this mail id.
          </p>
        </div>
      </div>
    `
  })
};
