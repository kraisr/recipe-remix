import React, { useState } from "react";
import Box from "@mui/material/Box";
import Logo from "../../components/Navbar/Logo";
import ContactForm from "./ContactForm";
import EmailSent from "./EmailSent";

function Help() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const handleReset = () => {
        setIsEmailSent(false);
    };

    return (
        <Box 
            sx={{
                mt: 2,  // Vertical margin
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh", // Ensure it takes at least the full height of the viewport
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#a1c298",
                    borderRadius: "8px",
                    p: 4,
                    width: ["90%", "60%", "40%", "30%"],  // Responsive width
                    mx: "auto",
                    my: 4,  // Vertical margin
                    textAlign: "center",  // Ensure all text inside is centered
                    fontSize: ["3vw", "2vw", "1.5vw", "1vw"],  // Responsive font size
                }}
            >
                {isEmailSent ? (
                    <EmailSent onReset={handleReset} />
                ) : (
                    <ContactForm userEmail={localStorage.email} onEmailSent={() => setIsEmailSent(true)} />
                )}
        </Box>
    </Box>
    );
    };

export default Help;
