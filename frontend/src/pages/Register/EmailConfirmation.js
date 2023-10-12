import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import Logo from "../../components/Navbar/Logo";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const EmailConfirmation = () => {
  const { token } = useParams();  // Extract token from URL
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [message, setMessage] = useState(""); // State to manage message
  const [isSuccessMessage, setIsSuccessMessage] = useState(true); // State to determine if the message is of type success

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Send token to server to confirm email
        const response = await fetch(
            `http://localhost:8080/auth/confirm-email/${token}`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // No need to send the body in this case, as the token is already in the URL
          }
        );

        const data = await response.json();

        // Check if email confirmation was successful
        console.log(data);
        if (data.message === "Email verified successfully") {
          setConfirmationStatus("success");
        } else {
          setConfirmationStatus("error");
        }
      } catch (error) {
        setConfirmationStatus("error");
      }
    };

    // Call the async function
    confirmEmail();
  }, [token]);

  const handleResendEmailClick = async () => {
    // Logic to resend the email
    try {
      const emailResponse = await fetch("http://localhost:8080/auth/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
  
      const emailData = await emailResponse.json();
  
      if (emailData && emailResponse.ok) {
        setMessage("Confirmation email sent successfully!");
        setIsSuccessMessage(true);  // It"s a success message
      } else {
        setMessage(emailData.error || "Error sending confirmation email.");
        setIsSuccessMessage(false);  // It"s an error message
      }
    } catch (error) {
      setMessage("Error sending confirmation email.");
      setIsSuccessMessage(false);  // It"s an error message
    }
  };

  return (
    <Box>
      <Logo />
      <Box p="2rem" m="2rem auto" borderRadius="1.5rem">
        <Container component="main" maxWidth="xs">
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Email Confirmation
            </Typography>
            
            {/* Message display */}
            {message && (
            <Typography 
                variant="body2" 
                sx={{ color: isSuccessMessage ? "green" : "red", fontWeight: "bold", mb: 2, textAlign: "center" }}
            >
                {message}
            </Typography>
            )}

            {confirmationStatus === "success" && (
            <>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4CAF50", display: "block", mx: "auto", my: 3 }} />
            <Typography variant="body1" paragraph>
                Your email has been confirmed successfully! You can now log in.
            </Typography>
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 4, backgroundColor: "#fa7070", color: "#fff", "&:hover": { backgroundColor: "#e64a4a" }}}
                onClick={() => navigate("/login")}
            >
                Go to Login
            </Button>
            </>
            )}

            {confirmationStatus === "error" && (
                <>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: "#F44336", display: "block", mx: "auto", my: 3 }} />
                <Typography variant="body1" paragraph sx={{ color: "red", fontWeight: "bold" }}>
                    Something went wrong. The confirmation link may be invalid or expired.
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                        mt: 2, 
                        backgroundColor: "#fa7070",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#e64a4a",
                        }
                    }}
                    onClick={handleResendEmailClick}
                >
                    Resend Confirmation Email
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                        mt: 2, 
                        backgroundColor: "#455A64",
                        color: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#607D8B",
                        }
                    }}
                    onClick={() => navigate("/login")}
                >
                    Go to Login
                </Button>
                </>
            )}
        </Container>
      </Box>
    </Box>
  );
};

export default EmailConfirmation;
