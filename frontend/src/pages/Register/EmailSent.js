import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

const EmailSent = ({ email }) => {
  const [message, setMessage] = useState("");  // Message state
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);  // Message type state
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleResendEmail = async () => {
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
        setIsSuccessMessage(true);  // It's a success message
      } else {
        setMessage(emailData.error || "Error sending confirmation email.");
        setIsSuccessMessage(false);  // It's an error message
      }
    } catch (error) {
      setMessage("Error sending confirmation email.");
      setIsSuccessMessage(false);  // It's an error message
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
        Email Sent!
      </Typography>
      
      <EmailIcon sx={{ fontSize: 80, color: "#fa7070", display: "block", mx: "auto", my: 3 }} />
      
      <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
        A confirmation email has been sent to your email address. Please check your inbox and click on the confirmation link to verify your account before logging in.
      </Typography>

      {/* Conditionally rendered message */}
      {message && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: "bold", 
            mb: 2, 
            textAlign: "center",
            color: isSuccessMessage ? "green" : "red"  // Conditional color based on message type
          }}
        >
          {message}
        </Typography>
      )}

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
        onClick={handleResendEmail}
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
        onClick={handleLoginClick}
      >
        Go to Login
      </Button>
    </Container>
  );
};

export default EmailSent;
