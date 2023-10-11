import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TimerIcon from '@mui/icons-material/Timer';

function EmailSent() {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xs">
            <Box textAlign="center" mb={4}>
                <MailOutlineIcon sx={{ fontSize: 48, color: '#fa7070' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} align="center">
                Check Your Email
            </Typography>
            <Typography variant="body1" paragraph align="center">
                We've sent a link to reset your password to the email address you provided. 
                Please check your email and follow the instructions to reset your password.
            </Typography>
            <Box display="flex" alignItems="center" mb={2} justifyContent="center">
                <TimerIcon sx={{ color: '#fa7070', marginRight: 1 }} />
                <Typography variant="body1">
                    The link is valid for 15 minutes. 
                </Typography>
            </Box>
            <Typography variant="body1" paragraph align="center">
                If you do not reset your password within 15 minutes, you will need to submit a new request.
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
                Back to Login
            </Button>
        </Container>
    );
}


export default EmailSent;
