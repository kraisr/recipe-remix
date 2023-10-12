import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";

function EmailSent({ onReset }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#a1c298",
                borderRadius: "8px",
                p: 4,
                width: ["90%", "60%", "40%", "30%"],
                mx: "auto",
                my: 4,
                textAlign: "center",
            }}
        >
            <CheckCircleIcon sx={{ fontSize: 80, color: "#fa7070" }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
                Email Sent Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                We have received your message and will get back to you shortly.
            </Typography>
            <Button 
                variant="contained" 
                sx={{ mt: 4, backgroundColor: "#fa7070", color: "#fff", whiteSpace: "nowrap", "&:hover": { backgroundColor: "#e64a4a" }}}
                onClick={onReset}
            >
                Send Another Email
            </Button>
        </Box>
    );
}

export default EmailSent;
