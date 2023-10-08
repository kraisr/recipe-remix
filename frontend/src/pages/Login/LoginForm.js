import React, { useState } from "react";
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

// Better form handling with Formik
import { Formik } from "formik";
// Validation schema for Yup
import * as yup from "yup";

/* Validation of input in the login form */
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginForm = ({ onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/Register");
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(
      "http://localhost:8080/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      // Use states to store token and user
      // dispatch(
      //   setLogin({
      //     token: loggedIn.token,
      //     user: loggedIn.user,
      //   })
      // )
      navigate("/");
    }
  };

  const handleSubmit = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Login</Typography>
      <Formik 
        onSubmit={handleSubmit} 
        initialValues={initialValuesLogin} 
        validationSchema={loginSchema}
      >
        {({ values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm 
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="User Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              sx={{ bgcolor: "#fbf2cf" }}
            />
            <TextField
              label="User Password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              variant="outlined"
              margin="normal"
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              required
              fullWidth
              autoFocus
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              sx={{ bgcolor: "#fbf2cf" }}
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
                  mt: 2, 
                  backgroundColor: "#fa7070",
                  color: "#fff",
                  "&:hover": {
                      backgroundColor: "#e64a4a",  // Darker red on hover
                  }
              }}
            >
              Login
            </Button>
            <Button
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
              onClick={handleRegisterClick}
            >
              Don"t have an account? Register
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default LoginForm;
