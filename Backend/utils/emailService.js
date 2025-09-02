import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path:"/home/nitish/Desktop/Chatapp/Backend/.env"});

// Create transporter for sending emails
const createTransporter = () => {
  
    
    if (process.env.NODE_ENV === 'production') {
        
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else {
        
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password'
            }
        });
    }
};

// Send verification email pathaune
export const sendVerificationEmail = async (email, verificationToken, firstName) => {
    try {
        const transporter = createTransporter();
        
        // Create a shorter verification code (6 digits)
        const verificationCode = verificationToken.substring(0, 6).toUpperCase();
        
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify-email?token=${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Verify Your Email - ChatApp',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Welcome to Expenses Traker APP!</h1>
                    </div>
                    
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h2 style="color: #333;">Hi ${firstName},</h2>
                        <p style="color: #666; line-height: 1.6;">
                            Thank you for creating an account with Expenses Traker! To complete your registration, 
                            please verify your email address using one of the methods below:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: #667eea; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Your Verification Code</h3>
                                <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; font-family: monospace;">
                                    ${verificationCode}
                                </div>
                            </div>
                            
                            <a href="${verificationUrl}" 
                               style="background: #28a745; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;
                                      font-weight: bold;">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="margin: 0 0 10px 0; color: #1976d2;">How to verify:</h4>
                            <ol style="margin: 0; padding-left: 20px; color: #1976d2;">
                                <li><strong>Option 1:</strong> Enter the verification code above on the verification page</li>
                                <li><strong>Option 2:</strong> Click the "Verify Email Address" button above</li>
                            </ol>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            If the button doesn't work, you can copy and paste this link into your browser:
                        </p>
                        <p style="color: #667eea; word-break: break-all; font-size: 14px;">
                            ${verificationUrl}
                        </p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            This verification link will expire in 1.5 minutes. If you didn't create this account, 
                            you can safely ignore this email.
                        </p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Best regards,<br>
                            The ChatApp Team
                        </p>
                    </div>
                    
                    <div style="background: #333; padding: 15px; text-align: center; color: white; font-size: 12px;">
                        <p style="margin: 0;">© 2024 ChatApp. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully:', result.messageId);
        return true;
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, firstName) => {
    try {
        const transporter = createTransporter();
        
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Reset Your Password - Expense Traker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
                    </div>
                    
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h2 style="color: #333;">Hi ${firstName},</h2>
                        <p style="color: #666; line-height: 1.6;">
                            We received a request to reset your password. Click the button below to create a new password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: #667eea; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;
                                      font-weight: bold;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            If you didn't request a password reset, you can safely ignore this email. 
                            Your password will remain unchanged.
                        </p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            This reset link will expire in 1.5 minutes.
                        </p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Best regards,<br>
                            Team nitish
                        </p>
                    </div>
                    
                    <div style="background: #333; padding: 15px; text-align: center; color: white; font-size: 12px;">
                        <p style="margin: 0;">© 2024  All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', result.messageId);
        return true;
        
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};
