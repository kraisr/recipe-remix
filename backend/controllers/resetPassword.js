import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as dotenv from "dotenv";

dotenv.config();

export const requestResetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find specified user given email using mongoose
        const user = await User.findOne({ email: email });

        // Check if user registered with Google, prevent login through this endpoint
        if(user?.googleSignIn) {
            return res.status(401).json({ error: "User registered with Google. Please use Google sign-in." });
        }

        // If user does not exist, return error
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Not verified email
        if (!user.isEmailVerified) {
            return res.status(400).json({ error: "Email not verified" });
        }

        // Generate a password reset token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }  // 15 minutes
        );
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + (15 * 60 * 1000); // Token expires in 15 minutes
        // user.passwordResetExpires = Date.now() + (0 * 60 * 1000); // Token expires immediately
        await user.save();

        // Send the token via email to the user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "app.reciperemix@gmail.com",
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            }
        });
        

        const mailOptions = {
            from: "app.reciperemix@gmail.com",
            to: user.email,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

Please click on the following link, or paste this into your browser to complete the process within 15 minutes of receiving it:
http://localhost:3000/resetPassword/${token}

If you did not request this, please ignore this email and your password will remain unchanged.`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error("there was an error: ", err);
            } else {
                console.log("here is the response: ", response);
                res.status(200).json("recovery email sent");
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verify the token and extract the user's ID
        let userId;
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            userId = decodedToken.id;
        } catch (err) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Find the user and ensure the token is valid and not expired
        const user = await User.findOne({ 
            _id: userId, 
            passwordResetToken: token, 
            passwordResetExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ error: "Token is invalid or has expired" });
        }

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password cannot be the same as the old password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Update the user's password and invalidate the token
        user.password = passwordHash;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while resetting the password" });
    }
};