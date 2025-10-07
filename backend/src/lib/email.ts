import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@microlearn.com';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

let transporter: Transporter | null = null;

/**
 * Initialize email transporter
 */
function getTransporter(): Transporter {
  if (!transporter) {
    // If SMTP credentials are not provided, use a test account
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn('⚠️  SMTP credentials not configured. Emails will be logged to console.');
      // Return a mock transporter that just logs
      transporter = {
        sendMail: async (mailOptions: any) => {
          console.log('\n📧 EMAIL (Development Mode):');
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          console.log('Body:\n', mailOptions.html || mailOptions.text);
          console.log('---\n');
          return { messageId: 'mock-message-id' };
        },
      } as any;
    } else {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 32px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .button:hover {
            background: #2563eb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .code {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🎓 MicroLearn</h1>
          </div>

          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Welcome to MicroLearn! Please verify your email address to get started.</p>
            <p>Click the button below to verify your email:</p>

            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <div class="code">${verificationUrl}</div>

            <p><strong>This link will expire in 24 hours.</strong></p>

            <p>If you didn't create an account with MicroLearn, you can safely ignore this email.</p>
          </div>

          <div class="footer">
            <p>© 2025 MicroLearn. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Welcome to MicroLearn! Please verify your email address to get started.

Click this link to verify your email:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with MicroLearn, you can safely ignore this email.

© 2025 MicroLearn. All rights reserved.
  `;

  await sendEmail({
    to: email,
    subject: 'Verify your email address - MicroLearn',
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 32px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .button:hover {
            background: #2563eb;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .code {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🎓 MicroLearn</h1>
          </div>

          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your password for your MicroLearn account.</p>
            <p>Click the button below to reset your password:</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <div class="code">${resetUrl}</div>

            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </div>

            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>

          <div class="footer">
            <p>© 2025 MicroLearn. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

We received a request to reset your password for your MicroLearn account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email.

© 2025 MicroLearn. All rights reserved.
  `;

  await sendEmail({
    to: email,
    subject: 'Reset your password - MicroLearn',
    html,
    text,
  });
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const loginUrl = `${APP_URL}/auth/login`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MicroLearn</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 32px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .features {
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .features h3 {
            margin-top: 0;
            color: #111827;
          }
          .features ul {
            margin: 0;
            padding-left: 20px;
          }
          .features li {
            margin: 8px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🎓 MicroLearn</h1>
          </div>

          <div class="content">
            <h2>Welcome aboard, ${name}! 🎉</h2>
            <p>Your email has been verified successfully. You're now ready to start your learning journey with MicroLearn!</p>

            <div class="features">
              <h3>What you can do now:</h3>
              <ul>
                <li>📚 Browse hundreds of micro-learning courses</li>
                <li>🎯 Enroll in courses and track your progress</li>
                <li>💬 Join discussions with other learners</li>
                <li>🏆 Earn certificates upon course completion</li>
                <li>📊 Monitor your learning statistics</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Start Learning Now</a>
            </div>

            <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
          </div>

          <div class="footer">
            <p>© 2025 MicroLearn. All rights reserved.</p>
            <p>Happy Learning! 📖</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome aboard, ${name}!

Your email has been verified successfully. You're now ready to start your learning journey with MicroLearn!

What you can do now:
- Browse hundreds of micro-learning courses
- Enroll in courses and track your progress
- Join discussions with other learners
- Earn certificates upon course completion
- Monitor your learning statistics

Start learning now: ${loginUrl}

© 2025 MicroLearn. All rights reserved.
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to MicroLearn! 🎉',
    html,
    text,
  });
}
