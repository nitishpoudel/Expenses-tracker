import express from "express";
import { 
    login, 
    logout, 
    register, 
    addExpense, 
    getUserExpenses, 
    updateExpense, 
    deleteExpense,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
} from "../Controller/userdetail.js";
import { generateAIResponse } from "../Controller/aiController.js";

const router = express.Router();

// Authentication routes
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)

// Email verification routes
router.route('/verify-email/:token').get(verifyEmail)
router.route('/resend-verification').post(resendVerificationEmail)

// Password reset routes
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

// Expense routes
router.route('/expenses').post(addExpense)
router.route('/expenses').get(getUserExpenses)
router.route('/expenses').put(updateExpense)
router.route('/expenses/:id').delete(deleteExpense)

// AI routes
router.route('/ai/generate').post(generateAIResponse)

export default router;