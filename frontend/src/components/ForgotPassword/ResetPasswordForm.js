import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import * as yup from "yup";

const passwordResetSchema = yup.object().shape({
    password: yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(
        /\d/,
        "Password must contain at least one digit"
        )
        .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const initialValues = {
    password: "",
    confirmPassword: "",
};

const ResetPasswordForm = ({ onResetSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    const resetPassword = async (values) => {
        try {
            const response = await fetch(
                "http://localhost:8080/user/resetPassword", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, password: values.password }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                setError(data.error);
                return;
            }

            setSuccess("Password reset successfully. Redirecting to login...");
            onResetSuccess(true); // Set resetSuccess to true if password reset is successful
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Reset Password
            </Typography>
            {error && <Typography variant="body2" sx={{ color: "red", fontWeight: "bold", mb: 2 }}>
                {error}
            </Typography>}
            {success && <Typography variant="body2" sx={{ color: "green", fontWeight: "bold", mb: 2 }}>
                {success}
            </Typography>}
            {!success && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={passwordResetSchema}
                    onSubmit={resetPassword}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        submitCount,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="New Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.password) && Boolean(errors.password) && submitCount > 0}
                                helperText={(touched.password && errors.password && submitCount > 0) ? errors.password : ""}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                sx={{ 
                                    bgcolor: "#fbf2cf",
                                    '& label.Mui-focused': {
                                      color: '#6b9466',  // Color of the label when input is focused
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: '#a1c298',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#88b083',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#6b9466',
                                      },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                          <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={() => setShowPassword(!showPassword)}
                                          >
                                              {showPassword ? <Visibility /> : <VisibilityOff />}
                                          </IconButton>
                                      </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={values.confirmPassword}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword) && submitCount > 0}
                                helperText={(touched.confirmPassword && errors.confirmPassword && submitCount > 0) ? errors.confirmPassword : ""}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                sx={{ 
                                    bgcolor: "#fbf2cf",
                                    '& label.Mui-focused': {
                                      color: '#6b9466',  // Color of the label when input is focused
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: '#a1c298',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#88b083',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#6b9466',
                                      },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                          <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={() => setShowPassword(!showPassword)}
                                          >
                                              {showPassword ? <Visibility /> : <VisibilityOff />}
                                          </IconButton>
                                      </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
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
                            >
                                Reset Password
                            </Button>
                        </form>
                    )}
                </Formik>
            )}
        </Container>
    );
}

export default ResetPasswordForm;
