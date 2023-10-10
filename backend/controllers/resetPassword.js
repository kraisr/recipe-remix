import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

        // Generate a password reset token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // 1 hour
        );
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send the token via email to the user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "app.reciperemix@gmail.com",
                // clientId: "process.env.GOOGLE_CLIENT_ID",
                // clientSecret: "process.env.GOOGLE_CLIENT_SECRET",
                // refreshToken: "process.env.GOOGLE_REFRESH_TOKEN",
                // accessToken: "process.env.GOOGLE_ACCESS_TOKEN",
                clientId: "290841881270-560ekdio0feevgbulfvhnscked96d591.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//04tEgHU7kg71CCgYIARAAGAQSNwF-L9Ir0SrHYGgqa3WdIc79dCSO4OSKRE8LPDeHuX1SYZYO0u-Wc-Mz17qdrnBUtjce2k_G9DU",
                accessToken: "ya29.a0AfB_byALvW9T_yXCxn4Hyqr-9w8i-Bw2koqxMiWUrm63ySheTy7zX6nqY_UOBZqy6DzaePkQ8aq1Q5WWAkSXbdJt-2JY06QCsAgb-7iZAanxHzKM1wWNLY_hnl7qGV1j3EFlCTE6h30_O2oURSwP_fsx59414lo8gNl-aCgYKAVwSAQ4SFQGOcNnCmZL9UZ79WGmkFzl2-Cx8gA0171",
            }
        });
        

        const mailOptions = {
            from: "app.reciperemix@gmail.com",
            to: user.email,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
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
        
        // Hash the new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Update the user"s password in the database
        await User.findByIdAndUpdate(userId, { password: passwordHash });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while resetting the password" });
    }
};