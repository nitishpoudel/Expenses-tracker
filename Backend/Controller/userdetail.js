import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser } from "../Model/usermode.js";
import { Expense } from "../Model/expenseModel.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js";

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Process and validate the data
        const finalFirstName = firstname?.trim();
        const finalLastName = lastname?.trim();
        const finalEmail = email?.trim().toLowerCase();

        console.log("Processed data:", { finalFirstName, finalLastName, email: finalEmail, password });

        // Validate required fields
        if (!finalFirstName || !finalLastName || !finalEmail || !password) {
            console.log("Validation failed:", { finalFirstName, finalLastName, email: finalEmail, password });
            return res.status(400).json({
                success: false,
                message: "All fields must be filled",
            });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(finalEmail)) {
            console.log("Invalid email format:", finalEmail);
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Validate password length
        if (password.length < 6) {
            console.log("Password too short:", password.length);
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        console.log("Checking if email exists:", finalEmail);
        // Check if the email already exists
        const existingEmail = await createUser.findOne({ email: finalEmail });
        if (existingEmail) {
            console.log("Email already exists:", finalEmail);
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        console.log("Hashing password...");
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 1.5 * 60 * 1000); // 1.5 minutes

        console.log("Creating user...");
        // Create the user with verification token
        const newUser = await createUser.create({
            firstname: finalFirstName,
            lastname: finalLastName,
            email: finalEmail,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry,
            isVerified: false
        });

        console.log("User created successfully:", newUser._id);

        // Send verification email
        const emailSent = await sendVerificationEmail(finalEmail, verificationToken, finalFirstName);
        
        if (!emailSent) {
            console.log("Failed to send verification email, but user was created");
        }

        return res.status(201).json({
            success: true,
            message: "Account created successfully! Please check your email to verify your account.",
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
            },
            emailVerificationSent: emailSent
        });
    } catch (error) {
        console.error("Error during registration:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async(req, res) => {
    try {
        const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            sucess:false,
            message:"All fields are required",
        })
    }
    const user = await createUser.findOne({email})
    console.log(' Login attempt for email:', email);
    console.log(' User found:', user ? 'Yes' : 'No');
    if (user) {
        console.log(' User details:', {
            id: user._id,
            email: user.email,
            isVerified: user.isVerified,
            hasVerificationToken: !!user.verificationToken
        });
    }
    
    if(!user){
        return res.status(400).json({
            sucess:false,
            message:"Invalid email or password",
        })
    }

    // Check if email is verified
    console.log('🔍 Checking verification status:', user.isVerified);
    
    // TEMPORARY BYPASS: Allow login for existing verified users
    if (!user.isVerified && user.email === 'nitishpaudel260@gmail.com') {
        console.log('🔍 TEMPORARY BYPASS: Allowing login for existing user');
        // Update user verification status
        user.isVerified = true;
        await user.save();
    }
    
    if (!user.isVerified) {
        console.log('🔍 User not verified, blocking login');
        return res.status(401).json({
            success: false,
            message: "Please verify your email before logging in. Check your inbox for the verification link."
        });
    }

    const passwordvalidation =  await bcrypt.compare(password,user.password)
    if(!passwordvalidation){
        return res.status(400).json({
            sucess:false,
            message:"Invalid email or password",
        })
    }
    const jwtSecret = process.env.SECRET_KEY || process.env.SCERATE_KEY;
    const token = Jwt.sign({userId : user ._id }, jwtSecret,{
        expiresIn:"7d"
    })
    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.status(200).json({
        sucess:true,
        message:`welcome back ${user.firstname}`,
        user,
        token
    });
        
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"failed to login"
        })
        
    }
}

// Verify email endpoint
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        console.log('🔍 Verification attempt with token:', token ? token.substring(0, 10) + '...' : 'undefined');

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        let user;

        // Check if it's a 6-character code or full token
        if (token.length === 6) {
            // It's a 6-character verification code, find user with token starting with this code
            console.log('🔍 Searching for user with 6-character code:', token);
            user = await createUser.findOne({
                verificationToken: { $regex: `^${token}`, $options: 'i' },
                verificationTokenExpiry: { $gt: Date.now() }
            });
        } else {
            // It's a full token
            console.log('🔍 Searching for user with full token');
            user = await createUser.findOne({
                verificationToken: token,
                verificationTokenExpiry: { $gt: Date.now() }
            });
        }

        if (!user) {
            // Check if token/code exists but is expired
            let expiredUser;
            if (token.length === 6) {
                expiredUser = await createUser.findOne({
                    verificationToken: { $regex: `^${token}`, $options: 'i' }
                });
            } else {
                expiredUser = await createUser.findOne({
                    verificationToken: token
                });
            }
            
            if (expiredUser) {
                return res.status(400).json({
                    success: false,
                    message: "Verification token has expired. Please request a new verification email."
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification token"
                });
            }
        }

        // Mark user as verified and clear verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        console.log(' User verified successfully:', user.email);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in to your account."
        });

    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify email"
        });
    }
};

// Resend verification email
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await createUser.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 1.5 * 60 * 1000); // 1.5 minutes

        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = verificationTokenExpiry;
        await user.save();

        // Send new verification email
        const emailSent = await sendVerificationEmail(email, verificationToken, user.firstname);

        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: "Verification email sent successfully! Please check your inbox."
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. Please try again."
            });
        }

    } catch (error) {
        console.error("Error resending verification email:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend verification email"
        });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await createUser.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent."
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1.5 * 60 * 1000); // 1.5 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send password reset email
        const emailSent = await sendPasswordResetEmail(email, resetToken, user.firstname);

        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: "Password reset email sent successfully! Please check your inbox."
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send password reset email. Please try again."
            });
        }

    } catch (error) {
        console.error("Error in forgot password:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request"
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Find user with valid reset token
        const user = await createUser.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password and clear reset token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully! You can now log in with your new password."
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};

export  const logout = async(req,res) =>{
    res.clearCookie("jwt");
    return res.status(200).json({
        sucess:true,
        message:"logout sucessfull",
        
    })
}

// Add new expense
export const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = Jwt.verify(token, process.env.SECRET_KEY || process.env.SCERATE_KEY);
        const userId = decoded.userId;

        const newExpense = new Expense({
            userId,
            title,
            amount: parseFloat(amount),
            category,
            date: new Date(date)
        });

        await newExpense.save();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense
        });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add expense",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user expenses
export const getUserExpenses = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = Jwt.verify(token, process.env.SECRET_KEY || process.env.SCERATE_KEY);
        const userId = decoded.userId;

        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            expenses
        });
    } catch (error) {
        console.error("Error getting expenses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get expenses",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update expense
export const updateExpense = async (req, res) => {
    try {
        const { id, title, amount, category, date } = req.body;
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = Jwt.verify(token, process.env.SECRET_KEY || process.env.SCERATE_KEY);
        const userId = decoded.userId;

        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            { title, amount: parseFloat(amount), category, date: new Date(date) },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update expense",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete expense
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = Jwt.verify(token, process.env.SECRET_KEY || process.env.SCERATE_KEY);
        const userId = decoded.userId;

        const expense = await Expense.findOneAndDelete({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete expense",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};







