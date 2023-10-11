import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function ResetSuccess() {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xs">
            <Box textAlign="center" mb={3}>
                <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#4CAF50' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} align="center">
                Password Reset Successfully
            </Typography>
            <Typography variant="body1" paragraph align="center">
                Your password has been reset successfully. You can now use your new password to login to your account.
            </Typography>
            <Button
                fullWidth
                variant="contained"
                sx={{ 
                    mt: 4, 
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "#388E3C",
                    }
                }}
                onClick={() => navigate('/login')}
            >
                Go to Login
            </Button>
        </Container>
    );
}

export default ResetSuccess;
