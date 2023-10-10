import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

        // Find specified user given email using mongoose
        const oldUser = await User.findOne({ email: email });
        // Check if user registered with Google, prevent login through this endpoint
        if(oldUser && oldUser.googleSignIn) {
            return res.status(401).json({ error: "User registered with Google. Please use Google sign-in." });
        }
        
        if (oldUser) {
            return res.status(400).json({ error: "User already registered." });
        }

        // Password encryption with bcrypt salt and hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user in the database
        const newUser = new User ({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        // Send back the saved user to the frontend
        const savedUser = await newUser.save();
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

        // Compare user password with hashed password stored in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}

/* GOOGLE LOGIN USER */
export const loginGoogle = async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        // console.log(req.body);
        // Find specified user given email using mongoose
        let user = await User.findOne({ email: email });
        // console.log(user);
        // If user does not exist, register user
        if (!user) {
            user = new User({
                email,
                firstName,
                lastName,
                googleSignIn: true,
            });
            // console.log(user);
            user = await user.save();
        } else {
            return res.status(400).json({ error: "User registered with email. Please use login page." });
        }

        // Generate a JWT token like you do during a normal login
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // Respond to the client
        res.status(200).json({ user, token });
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}
