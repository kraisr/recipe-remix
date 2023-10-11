import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const EmailConfirmation = () => {
  const { token } = useParams();  // Extract token from URL
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const navigate = useNavigate();
  
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
        if (data.message === "Email verified successfully") {
          setConfirmationStatus('success');
        } else {
          setConfirmationStatus('error');
        }
      } catch (error) {
        setConfirmationStatus('error');
      }
    };

    // Call the async function
    confirmEmail();
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Email Confirmation
      </Typography>
      
      {confirmationStatus === 'success' && (
        <>
          <Typography variant="body1" paragraph>
            Your email has been confirmed successfully! You can now log in.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ 
              mt: 4, 
              backgroundColor: "#fa7070",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#e64a4a",
              }
            }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </>
      )}

      {confirmationStatus === 'error' && (
        <Typography variant="body1" paragraph sx={{ color: "red", fontWeight: "bold" }}>
          Something went wrong. The confirmation link may be invalid or expired.
        </Typography>
      )}

      {/* Possibly show a loader here while waiting for server response */}
      {!confirmationStatus && (
        <Typography variant="body1" paragraph>
          Confirming your email...
        </Typography>
      )}
    </Container>
  );
};

export default EmailConfirmation;
