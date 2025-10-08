import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter (use environment variables in production)
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'mail.mdrijonhossajibon.shop',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'noreply@mdrijonhossajibon.shop',
        pass: process.env.SMTP_PASS || 'noreply@mdrijonhossajibon.shop'
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  private getSimpleTemplate(content: string, title: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #f5f5f5;
                color: #333333;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #ffffff;
                padding: 30px 40px 20px;
                text-align: center;
                border-bottom: 1px solid #e0e0e0;
            }
            .logo {
                display: inline-block;
                margin-bottom: 15px;
            }
            .logo svg {
                width: 60px;
                height: 60px;
            }
            .company-name {
                font-size: 20px;
                font-weight: 600;
                color: #333333;
                margin: 0;
            }
            .content {
                padding: 40px;
            }
            .greeting {
                font-size: 16px;
                color: #333333;
                margin-bottom: 20px;
            }
            .message {
                font-size: 15px;
                color: #555555;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .info-section {
                margin: 25px 0;
            }
            .info-item {
                font-size: 15px;
                color: #555555;
                margin-bottom: 8px;
            }
            .info-label {
                font-weight: 500;
                color: #333333;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 500;
                font-size: 15px;
                margin: 20px 0;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .divider {
                border-top: 1px solid #e0e0e0;
                margin: 30px 0;
            }
            .footer {
                padding: 30px 40px;
                background-color: #f8f9fa;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            .footer-text {
                font-size: 13px;
                color: #666666;
                margin-bottom: 10px;
            }
            .unsubscribe {
                font-size: 12px;
                color: #888888;
            }
            .unsubscribe a {
                color: #007bff;
                text-decoration: none;
            }
            
            /* Alert Styles */
            .alert {
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                font-size: 14px;
            }
            .alert-success {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            .alert-warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
            }
            .alert-danger {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            
            /* Responsive */
            @media only screen and (max-width: 600px) {
                body {
                    padding: 10px;
                }
                .content, .header, .footer {
                    padding: 20px;
                }
                .logo svg {
                    width: 50px;
                    height: 50px;
                }
                .company-name {
                    font-size: 18px;
                }
                .button {
                    display: block;
                    text-align: center;
                    width: 100%;
                    max-width: 280px;
                    margin: 20px auto;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle -->
                        <circle cx="50" cy="50" r="48" fill="#F0B90B" stroke="#E6A500" stroke-width="2"/>
                        
                        <!-- Inner Shield Shape -->
                        <path d="M50 15 L75 25 L75 45 C75 60 62.5 75 50 85 C37.5 75 25 60 25 45 L25 25 Z" 
                              fill="#1A1A1A" stroke="#333" stroke-width="1"/>
                        
                        <!-- Letter S -->
                        <path d="M42 35 L58 35 C60 35 62 37 62 39 C62 41 60 43 58 43 L50 43 C46 43 43 46 43 50 C43 54 46 57 50 57 L58 57 C60 57 62 59 62 61 C62 63 60 65 58 65 L42 65 C40 65 38 63 38 61 C38 59 40 57 42 57 L50 57 C54 57 57 54 57 50 C57 46 54 43 50 43 L42 43 C40 43 38 41 38 39 C38 37 40 35 42 35 Z" 
                              fill="#F0B90B"/>
                        
                        <!-- Accent Lines -->
                        <line x1="30" y1="30" x2="35" y2="25" stroke="#F0B90B" stroke-width="2" stroke-linecap="round"/>
                        <line x1="70" y1="30" x2="75" y2="25" stroke="#F0B90B" stroke-width="2" stroke-linecap="round"/>
                        <line x1="30" y1="70" x2="35" y2="75" stroke="#F0B90B" stroke-width="2" stroke-linecap="round"/>
                        <line x1="70" y1="70" x2="75" y2="75" stroke="#F0B90B" stroke-width="2" stroke-linecap="round"/>
                        
                        <!-- Inner Glow Effect -->
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(240, 185, 11, 0.3)" stroke-width="1"/>
                    </svg>
                </div>
                <h1 class="company-name">Stter Admin Panel</h1>
            </div>
            
            <div class="content">
                ${content}
            </div>
            
            <div class="footer">
                <p class="footer-text">© 2024 Stter Admin Panel. All rights reserved.</p>
                <div class="unsubscribe">
                    <a href="#">Unsubscribe</a> from our mailing list
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendAuthenticationAlert(
    email: string, 
    adminData: {
      username: string;
      role: string;
      ip?: string;
      userAgent?: string;
      timestamp: Date;
      action: string;
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="greeting">Dear ${adminData.username},</div>
        
        <p class="message">
          This is a security alert that your authentication activity was detected on your Stter Admin Panel account.
        </p>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${adminData.username}</div>
          <div class="info-item"><span class="info-label">Role:</span> ${adminData.role}</div>
          <div class="info-item"><span class="info-label">Action:</span> ${adminData.action}</div>
          <div class="info-item"><span class="info-label">Time:</span> ${adminData.timestamp.toLocaleString()}</div>
          ${adminData.ip ? `<div class="info-item"><span class="info-label">IP Address:</span> ${adminData.ip}</div>` : ''}
        </div>
        
        <p class="message">
          If this was you, no further action is required. If you did not perform this action, please secure your account immediately.
        </p>
        
        <div class="alert alert-warning">
          <strong>Security Reminder:</strong> Stter Admin Panel will never ask for your password via email.
        </div>
        
        <p class="message">
          You can login to your admin panel to review security settings at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/security" class="button">Security Settings</a>
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Security Alert - Authentication Activity`,
        html: this.getSimpleTemplate(content, 'Security Alert'),
        text: `Security Alert: Authentication activity detected for ${adminData.username} at ${adminData.timestamp.toLocaleString()}`
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send authentication alert:', error);
      return false;
    }
  }

  async sendSuccessfulLogin(
    email: string,
    adminData: {
      username: string;
      role: string;
      ip?: string;
      timestamp: Date;
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="greeting">Dear ${adminData.username},</div>
        
        <p class="message">
          You have successfully signed in to your Stter Admin Panel account. Your session is now active and secure.
        </p>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${adminData.username}</div>
          <div class="info-item"><span class="info-label">Role:</span> ${adminData.role}</div>
          <div class="info-item"><span class="info-label">Login Time:</span> ${adminData.timestamp.toLocaleString()}</div>
          ${adminData.ip ? `<div class="info-item"><span class="info-label">IP Address:</span> ${adminData.ip}</div>` : ''}
        </div>
        
        <div class="alert alert-success">
          Welcome back! Your account is secure and ready to use.
        </div>
        
        <p class="message">
          You can access your dashboard at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/dashboard" class="button">Go to Dashboard</a>
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Login Successful - ${adminData.username}`,
        html: this.getSimpleTemplate(content, 'Login Successful'),
        text: `Login successful for ${adminData.username} at ${adminData.timestamp.toLocaleString()}`
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send login success email:', error);
      return false;
    }
  }

  async sendFailedLoginAttempt(
    email: string,
    adminData: {
      username: string;
      attempts: number;
      ip?: string;
      timestamp: Date;
      isLocked?: boolean;
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="greeting">Dear ${adminData.username},</div>
        
        <p class="message">
          We detected a failed login attempt on your Stter Admin Panel account. 
          ${adminData.isLocked ? 'Your account has been temporarily locked for security.' : 'Please ensure your account is secure.'}
        </p>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${adminData.username}</div>
          <div class="info-item"><span class="info-label">Failed Attempts:</span> ${adminData.attempts}</div>
          <div class="info-item"><span class="info-label">Time:</span> ${adminData.timestamp.toLocaleString()}</div>
          ${adminData.ip ? `<div class="info-item"><span class="info-label">IP Address:</span> ${adminData.ip}</div>` : ''}
          ${adminData.isLocked ? `<div class="info-item"><span class="info-label">Account Status:</span> Temporarily Locked</div>` : ''}
        </div>
        
        <div class="alert alert-danger">
          <strong>Security Action Required:</strong> 
          ${adminData.isLocked ? 
            'Your account is locked for 30 minutes. If this wasn\'t you, change your password immediately after the lockout period.' :
            'If this wasn\'t you, please change your password and enable two-factor authentication.'
          }
        </div>
        
        <p class="message">
          You can secure your account at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/security" class="button">Secure My Account</a>
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Security Alert - Failed Login Attempt`,
        html: this.getSimpleTemplate(content, 'Security Alert'),
        text: `Failed login attempt detected for ${adminData.username} at ${adminData.timestamp.toLocaleString()}`
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send failed login alert:', error);
      return false;
    }
  }

  /**
   * Send OTP email with verification code
   */
  async sendOTPEmail(
    email: string,
    otpData: {
      username: string;
      otp: string;
      expiresIn: number; // minutes
      purpose: 'login' | 'password_reset' | 'account_verification';
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="greeting">Dear ${otpData.username},</div>
        
        <p class="message">
          You have requested a verification code for your Stter Admin Panel account. 
          Please use the code below to complete your ${otpData.purpose.replace('_', ' ')}.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #007bff; padding: 20px 30px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 3px;">
            ${otpData.otp}
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${otpData.username}</div>
          <div class="info-item"><span class="info-label">Purpose:</span> ${otpData.purpose.replace('_', ' ').toUpperCase()}</div>
          <div class="info-item"><span class="info-label">Valid for:</span> ${otpData.expiresIn} minutes</div>
          <div class="info-item"><span class="info-label">Generated at:</span> ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="alert alert-warning">
          <strong>Security Notice:</strong> This code will expire in ${otpData.expiresIn} minutes. Do not share this code with anyone. If you didn't request this code, please contact support immediately.
        </div>
        
        <p class="message">
          If you're having trouble, you can contact our support team for assistance.
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Verification Code - ${otpData.otp}`,
        html: this.getSimpleTemplate(content, 'Verification Code'),
        text: `Your verification code is: ${otpData.otp}. This code expires in ${otpData.expiresIn} minutes. Purpose: ${otpData.purpose.replace('_', ' ')}`
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  /**
   * Send password reset email with secure reset link
   */
  async sendPasswordResetEmail(
    email: string,
    resetData: {
      username: string;
      resetToken: string;
      expiresIn: number; // minutes
      ip?: string;
    }
  ): Promise<boolean> {
    try {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify?token=${resetData.resetToken}`;
      
      const content = `
        <div class="greeting">Dear ${resetData.username},</div>
        
        <p class="message">
          You have requested to reset your password for your Stter Admin Panel account. 
          Click the button below to create a new password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px;">
            Reset Password 
          </a>
        </div>
        
        <p class="message">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        
        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 14px;">
          ${resetLink}
        </div>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${resetData.username}</div>
          <div class="info-item"><span class="info-label">Valid for:</span> ${resetData.expiresIn} minutes</div>
          <div class="info-item"><span class="info-label">Requested at:</span> ${new Date().toLocaleString()}</div>
          ${resetData.ip ? `<div class="info-item"><span class="info-label">IP Address:</span> ${resetData.ip}</div>` : ''}
        </div>
        
        <div class="alert alert-warning">
          <strong>Security Notice:</strong> This password reset link will expire in ${resetData.expiresIn} minutes. If you didn't request this reset, please ignore this email and contact support if you have concerns.
        </div>
        
        <p class="message">
          For security reasons, this link can only be used once. If you need another reset link, please request a new one.
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Password Reset Request  (expires in ${resetData.expiresIn} minutes)`,
        html: this.getSimpleTemplate(content, 'Password Reset'),
 
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send password reset confirmation email
   */
  async sendPasswordResetConfirmation(
    email: string,
    userData: {
      username: string;
      timestamp: Date;
      ip?: string;
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="greeting">Dear ${userData.username},</div>
        
        <p class="message">
          Your password has been successfully reset for your Stter Admin Panel account.
        </p>
        
        <div class="info-section">
          <div class="info-item"><span class="info-label">Username:</span> ${userData.username}</div>
          <div class="info-item"><span class="info-label">Reset completed:</span> ${userData.timestamp.toLocaleString()}</div>
          ${userData.ip ? `<div class="info-item"><span class="info-label">IP Address:</span> ${userData.ip}</div>` : ''}
        </div>
        
        <div class="alert alert-success">
          Your password has been successfully updated. You can now login with your new password.
        </div>
        
        <div class="alert alert-warning">
          <strong>Security Notice:</strong> If you didn't reset your password, please contact support immediately and secure your account.
        </div>
        
        <p class="message">
          You can login to your account at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login" class="button">Login to Dashboard</a>
        </p>
        
        <div class="divider"></div>
        
        <p class="message">
          Stter Admin Panel<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Admin Portal</a>
        </p>
      `;

      const emailData: EmailData = {
        to: email,
        subject: `Stter Admin Panel Password Reset Successful`,
        html: this.getSimpleTemplate(content, 'Password Reset Confirmation'),
        text: `Password reset successful for ${userData.username} at ${userData.timestamp.toLocaleString()}`
      };

      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });

      return true;
    } catch (error) {
      console.error('Failed to send password reset confirmation email:', error);
      return false;
    }
  }

  /**
   * Send OTP email with custom email data (legacy method)
   */
  async sendCustomOTPEmail(emailData: EmailData): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Stter Admin Panel Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        ...emailData
      });
      return true;
    } catch (error) {
      console.error('Failed to send custom OTP email:', error);
      return false;
    }
  }
}

export default new EmailService();
