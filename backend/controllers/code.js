import jwt from 'jsonwebtoken';

export const sendCode = async (req, res) => {
    try {
        const { code } = req.body;

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Find specified user given email using mongoose
        const user = await User.findById(userId);

        // If user does not exist, return error
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Generate a code token
        const codeToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // 1 hour
        );
        user.twoFACodeToken = codeToken;
        user.twoFACodeTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
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
                res.status(200).json("recovery email sent");
            }
        });

    } catch (err) {
        console.error("Error in sendCode:", err);
        res.status(500).json({ error: "An internal server error occurred. Please try again later." });
    }
}