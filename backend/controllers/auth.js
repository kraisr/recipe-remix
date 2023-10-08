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

        /* Testing request body */
        // console.log(firstName);
        // console.log(lastName);
        // console.log(email);
        // console.log(password);

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
            return res.status(400).json({ error: "User does not exist" });
        }

        // Compare user password with hashed password stored in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}