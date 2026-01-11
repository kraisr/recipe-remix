import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';


export const sendCode = async (req, res) => {
    try {
        const { code } = req.body;
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log(req.body);
        // Find specified user given email using mongoose
        const user = await User.findById(userId).select('-password');

        // If user does not exist, return error
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        //Generate a code token
        const codeToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // 1 hour
        );
        user.twoFACodeToken = codeToken;
        user.twoFACodeTokenExpires = Date.now(); // Token expires in 1 hour
        await user.save();

        //Send the token via email to the user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "app.reciperemix@gmail.com",
                clientId: "process.env.GOOGLE_CLIENT_ID",
                clientSecret: "process.env.GOOGLE_CLIENT_SECRET",
                refreshToken: "process.env.GOOGLE_REFRESH_TOKEN",
                accessToken: "process.env.GOOGLE_ACCESS_TOKEN",
            }
        });
        

        const mailOptions = {
            from: "app.reciperemix@gmail.com",
            to: user.email,
            subject: "6 Digit Code",
            text: `You are receiving this because you (or someone else) has enabled Two Factor Authentication for this account.
            Please enter the following 6 Digit Code to gain access to your Recipe Remix account:
                                        ${code}
            If you did not request this, please ignore this email and your password will remain unchanged.`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error("there was an error: ", err);
            } else {
                console.log("here is the response: ", response);
                res.status(200).json(`${code}`);
            }
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
}
