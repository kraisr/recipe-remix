import React, { useState } from "react";
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

// Better form handling with Formik
import { Formik } from "formik";
// Validation schema for Yup
import * as yup from "yup";

/* Validation of input in the register form */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // User clicked the "Login" button
    navigate("/Login");
  };

  /* Perform register logic here */
  const register = async (values, onSubmitProps) => {
    // FormData allows to send a form with an image
    // console.log(values);
    // const formData = new FormData();

    // // Append all values from the form to formData
    // for (let value in values) {
    //   formData.append(value, values[value]);
    // }

    // Manually append picture path to formData
    // formData.append("profilePicture", values.picture.name);

    // Send formData to backend
    const savedUserResponse = await fetch(
      "http://localhost:8080/auth/register", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    // Save the data into parsable json form
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      // Saved user successfully ==> redirect to login page
      navigate("/Login");
    }
  };

  const handleSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Register</Typography>
      <Formik 
        onSubmit={handleSubmit} 
        initialValues={initialValuesRegister} 
        validationSchema={registerSchema}
      >
        {({ values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
            submitCount, 
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              variant="outlined"
              margin="normal"
              name="firstName"
              error={Boolean(touched.firstName) && Boolean(errors.firstName) && submitCount > 0}
              helperText={(touched.firstName && errors.firstName && submitCount > 0) ? errors.firstName : ""}
              required
              fullWidth
              autoFocus
              sx={{ bgcolor: "#fbf2cf" }}
            />
            <TextField
              label="Last Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              variant="outlined"
              margin="normal"
              name="lastName"
              error={Boolean(touched.lastName) && Boolean(errors.lastName) && submitCount > 0}
              helperText={(touched.lastName && errors.lastName && submitCount > 0) ? errors.lastName : ""}
              required
              fullWidth
              sx={{ bgcolor: "#fbf2cf" }}
            />
            <TextField
              label="User Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email) && submitCount > 0}
              helperText={(touched.email && errors.email && submitCount > 0) ? errors.email : ""}
              variant="outlined"
              margin="normal"
              required
              fullWidth
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
              error={Boolean(touched.password) && Boolean(errors.password) && submitCount > 0}
              helperText={(touched.password && errors.password && submitCount > 0) ? errors.password : ""}
              required
              fullWidth
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
            {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            /> */}
            <Button
              type="submit"
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
            >
              Register
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
              onClick={handleLoginClick}
            >
              Already have an account? Login
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default RegisterForm;
