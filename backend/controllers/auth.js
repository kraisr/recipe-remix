import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

/* REGISTER USER */
export const register = async (req, res) => {
    // calls to mongoDB are asynchronous, so we need to use async/await
    try {
        // console.log(req.body);
        const { 
            firstName, 
            lastName,
            email, 
            password 
        } = req.body;
        console.log(req.body);

        // Find specified user given email using mongoose
        const oldUser = await User.findOne({ email: email });
        // Check if user registered with Google, prevent login through this endpoint
        if(oldUser && oldUser.googleSignIn) {
            return res.status(401).json({ error: "User registered with Google. Please use Google sign-in." });
        }

        if (oldUser && !oldUser.isEmailVerified) {
            return res.status(400).json({ error: "User already registered. Please verify your email to login." });
        }
        
        if (oldUser) {
            return res.status(400).json({ error: "User already registered." });
        }

        // Extract username from email
        const username = email.substr(0, email.indexOf("@"));

        // Password encryption with bcrypt salt and hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user in the database
        const newUser = new User ({
            firstName,
            lastName,
            email,
            username,
            password: passwordHash,
        });
        console.log(newUser);
        // Send back the saved user to the frontend
        const savedUser = await newUser.save();
        console.log(savedUser);
        // // Send a confirmation email
        // await sendConfirmationEmail(req, res);

        // 201 = status for successful creation
        res.status(201).json(savedUser);
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        // Grab email and password from request body
        const { email, password } = req.body;
        
        // Find specified user given email using mongoose
        const user = await User.findOne({ email: email });
        
        // If user does not exist, return error
        if (!user) {
        return res.status(400).json({ error: "Invalid credentials." });
        }

        // Check if user registered with Google, prevent login through this endpoint
        if(user.googleSignIn) {
            return res.status(401).json({ error: "User registered with Google. Please use Google sign-in." });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ error: "Email not verified. Please verify your email." });
        }

        // Compare user password with hashed password stored in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        
        if (user.set2FA) {
            console.log('2FA enabled!');
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            delete user.password;
            return res.status(200).json({ set2FA: true, user, token });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            delete user.password;
            res.status(200).json({ set2FA: false, user, token });
        }
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}

/* GOOGLE LOGIN USER */
export const loginGoogle = async (req, res) => {
    try {
        const { email, firstName, lastName, image } = req.body;
        // console.log(req.body);
        // Find specified user given email using mongoose
        let user = await User.findOne({ email: email });
        // console.log(user);

        // Extract username from email
        const username = email.substr(0, email.indexOf("@"));

        // If user does not exist, register user
        if (!user) {
            user = new User({
                email,
                firstName,
                lastName,
                username,
                image,
                googleSignIn: true,
            });
            // console.log(user);
            user = await user.save();
        } else if (!user.googleSignIn) {
            return res.status(400).json({ error: "User registered with email. Please use login page." });
        }

        if (user.set2FA) {
            console.log('2FA enabled!');
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            
            return res.status(200).json({ set2FA: true, user, token });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          
            res.status(200).json({ set2FA: false, user, token });
        }
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}

/* SEND LINK TO VERIFY EMAIL */
export const sendConfirmationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user and generate a verification token
        const user = await User.findOne({ email: email });
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }  // expires in 24 hours
        );

        // Save the verification token to the user's record
        user.emailVerificationToken = token;
        user.emailVerificationTokenExpires = Date.now() + (24 * 60 * 60 * 1000); // Token expires in 24 hours
        // user.emailVerificationTokenExpires = Date.now() + (0 * 60 * 60 * 1000); // [MODIFY] Token expires immediately
        await user.save();

        // Send the email
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
            subject: "Please confirm your email address",
            text: `
                Thanks for registering with our service! Please confirm your email address by clicking the following link:
                
                http://localhost:3000/confirm-email/${token}
            `
        };

        await transporter.sendMail(mailOptions);

        // If this function is called independently, send a response
        if (!res.headersSent) {
            res.status(200).json({ message: "Confirmation email sent" });
        }
    } catch (err) {
        // If this function is called independently, send an error response
        if (!res.headersSent) {
            res.status(500).json({ error: "Error sending confirmation email" });
        }
    }
};

/* ON-CLICK EMAIL CONFIRMATION */
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;  // Extract token from URL parameters
        
        // Decode the token and find the user
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ 
            _id: userId, 
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() }  // Checking for token expiry
        });
    
        // If user doesn't exist, or token is invalid or expired, return an error
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
    
        // Set the email as verified and clear the token
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();
    
        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error verifying email" });
    }
};