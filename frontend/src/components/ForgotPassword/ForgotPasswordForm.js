import React from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";

// Validation schema
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const initialValues = {
  email: "",
};

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  // Handler to submit the email
  const handleSubmit = async (values, { setSubmitting }) => {
    // You might call an API to send a password reset email here
    console.log("Submitted email:", values.email);
    // For now, just log and reset form
    setSubmitting(false);
  };

  // Handler to navigate back to login
  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Forgot Password
      </Typography>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          submitCount,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              error={Boolean(touched.email) && Boolean(errors.email) && submitCount > 0}
              helperText={(touched.email && errors.email && submitCount > 0) ? errors.email : ""}
              variant="outlined"
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#a1c298",
                  },
                  "&:hover fieldset": {
                    borderColor: "#88b083",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6b9466",
                  },
                },
             }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                  mt: 1, 
                  backgroundColor: "#fa7070",
                  color: "#fff",
                  "&:hover": {
                      backgroundColor: "#e64a4a",  // Darker red on hover
                  }
              }}
            >
              Send Reset Email
            </Button>
            <Button
              type="button"
              onClick={handleBackToLogin}
              type="button"
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
            >
              Back to Login
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ForgotPasswordForm;
