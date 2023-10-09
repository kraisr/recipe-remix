import jwt from "jsonwebtoken";

/* MIDDLEWARE FOR TOKEN VERIFICATION */
export const verifyToken = async (req, res, next) => {
    try {
        // Grab token from request header
        let token = req.header("Authorization");

        // If no token, return error
        if (!token) {
            return res.status(403).send("Access denied");
        }

        // Remove "Bearer " from token
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Verification failed
        if (!verified) {
            return res.status(401).json({ error: "Token verification failed, authorization denied" });
        }

        // If token is verified, store the user id in the request
        req.userId = verified.id;
        // Proceed to next step of middleware
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}