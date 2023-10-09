export const user = async (req, res) => {
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
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ error: "Invalid credentials" });
        // }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        // 500 = status for server error + send error message returned by mongoDB
        res.status(500).json({ error: err.message });
    }
}