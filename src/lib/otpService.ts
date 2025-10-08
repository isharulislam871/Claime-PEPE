import emailService from './emailService';
import Admin from '@/models/Admin';

class OTPService {
  /**
   * Generate and send OTP to admin email
   */
  async generateAndSendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email }).select('+otp_code +exp_otp');
      
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      // Check admin status
      if (admin.status !== 'active') {
        return {
          success: false,
          message: `Account is ${admin.status}. Contact support for assistance.`
        };
      }

      // Check if account is locked
      if (admin.isLocked) {
        return {
          success: false,
          message: 'Account is temporarily locked. Please try again later.'
        };
      }

      // Generate new OTP
      const otp = admin.generateOTP();
      await admin.save();

      // Send OTP email
      const emailSent = await this.sendOTPEmail(admin.email, {
        username: admin.username,
        otp,
        expiresIn: '10 minutes'
      });

      if (!emailSent) {
        return {
          success: false,
          message: 'Failed to send OTP email. Please try again.'
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully to your email address'
      };

    } catch (error) {
      console.error('OTP generation error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Verify OTP for admin
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string; admin?: any }> {
    try {
      // Find admin by email and include OTP fields
      const admin = await Admin.findOne({ email }).select('+otp_code +exp_otp');
      
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      // Check admin status
      if (admin.status !== 'active') {
        return {
          success: false,
          message: `Account is ${admin.status}. Contact support for assistance.`
        };
      }

      // Verify OTP
      const isValidOTP = admin.verifyOTP(otp);
      
      if (!isValidOTP) {
        // Increment login attempts for invalid OTP
        admin.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (admin.loginAttempts >= 5) {
          admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        }
        
        await admin.save();
        
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Clear OTP and reset login attempts on successful verification
      admin.clearOTP();
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      admin.lastLogin = new Date();
      
      await admin.save();

      return {
        success: true,
        message: 'OTP verified successfully',
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
        }
      };

    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  /**
   * Send OTP email using the email service
   */
  private async sendOTPEmail(
    email: string, 
    otpData: {
      username: string;
      otp: string;
      expiresIn: string;
    }
  ): Promise<boolean> {
    try {
      const content = `
        <div class="success-badge">Security Code</div>
        <h2 class="title">Your TaskUp Admin OTP</h2>
        <p class="message">
          Hello ${otpData.username}, you have requested a One-Time Password (OTP) for secure access to your TaskUp Admin account.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="
            display: inline-block;
            background: linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%);
            color: #000;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            padding: 20px 30px;
            border-radius: 12px;
            border: 2px solid rgba(240, 185, 11, 0.3);
            box-shadow: 0 8px 20px rgba(240, 185, 11, 0.2);
          ">
            ${otpData.otp}
          </div>
        </div>
        
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Username:</span>
            <span class="info-value">${otpData.username}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Valid For:</span>
            <span class="info-value">${otpData.expiresIn}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Generated:</span>
            <span class="info-value">${new Date().toLocaleString()}</span>
          </div>
        </div>

        <div class="security-notice">
          <strong>Security Notice:</strong> This OTP is valid for ${otpData.expiresIn} only. 
          Never share this code with anyone. TaskUp staff will never ask for your OTP.
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login" class="button">
          Continue to Login
        </a>
      `;

      // Use the existing email service template system
      const emailData = {
        to: email,
        subject: `🔐 TaskUp Admin OTP: ${otpData.otp}`,
        html: this.getBinanceStyleTemplate(content, 'OTP Verification'),
        text: `Your TaskUp Admin OTP is: ${otpData.otp}. Valid for ${otpData.expiresIn}.`
      };

      // Send email using nodemailer (we'll need to access the transporter)
      return await emailService.sendCustomOTPEmail(emailData);

    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  /**
   * Get Binance-style email template (copied from emailService for OTP)
   */
  private getBinanceStyleTemplate(content: string, title: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0b0e11;
                color: #ffffff;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1e2329 0%, #2b3139 100%);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%);
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .logo-icon {
                width: 48px;
                height: 48px;
                background: #000;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                font-weight: bold;
                font-size: 20px;
                color: #f0b90b;
            }
            .logo-text {
                font-size: 28px;
                font-weight: 700;
                color: #000;
                margin: 0;
            }
            .content {
                padding: 40px 30px;
            }
            .success-badge {
                display: inline-block;
                background: linear-gradient(135deg, #02c076 0%, #00a65a 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 20px;
            }
            .title {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #ffffff;
            }
            .message {
                font-size: 16px;
                color: #b7bdc6;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            .info-box {
                background: rgba(240, 185, 11, 0.1);
                border: 1px solid rgba(240, 185, 11, 0.3);
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
            }
            .info-row:last-child {
                margin-bottom: 0;
            }
            .info-label {
                color: #b7bdc6;
                font-weight: 500;
            }
            .info-value {
                color: #ffffff;
                font-weight: 600;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%);
                color: #000;
                padding: 14px 28px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
            }
            .security-notice {
                background: rgba(248, 73, 96, 0.1);
                border: 1px solid rgba(248, 73, 96, 0.3);
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #f84960;
            }
            .footer {
                background: #1e2329;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #2b3139;
            }
            .footer-text {
                font-size: 14px;
                color: #848e9c;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">T</div>
                    <h1 class="logo-text">TaskUp</h1>
                </div>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p class="footer-text">
                    This OTP was generated for TaskUp Admin System security verification.
                </p>
                <p class="footer-text">
                    © 2024 TaskUp. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export default new OTPService();
