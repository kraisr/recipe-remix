import nodemailer from "nodemailer";
import bodyParser from "body-parser";

export const sendEmail = async (req, res) => {
    const { userContactEmail, subject, body } = req.body;

    try {
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

        // Formulate email options
        const mailOptions = {
            from: "app.reciperemix@gmail.com", // Sender address
            to: "app.reciperemix@gmail.com", // List of receivers
            subject: subject, // Subject line
            text: `From: ${userContactEmail}\n\n${body}` // Plain text body
        };
        
        // Send email
        await transporter.sendMail(mailOptions);

        // Respond to client
        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const updateReminder = async (req, res) => {
    const { userContactEmail, } = req.body;

    try {
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

        // Formulate email options
        const mailOptions = {
            from: "app.reciperemix@gmail.com", // Sender address
            to: userContactEmail, // List of receivers
            subject: subject, // Subject line
            text: `From: ${userContactEmail}\n\n${body}` // Plain text body
        };
        
        // Send email
        await transporter.sendMail(mailOptions);

        // Respond to client
        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).send("Internal Server Error");
    }
}