import React, { useState } from "react";
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

// Better form handling with Formik
import { Formik } from "formik";
// Validation schema for Yup
import * as yup from "yup";

/* Validation of input in the register form */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
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
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});


const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = ({ onRegistrationSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    console.log(savedUser);

    if (savedUser && savedUserResponse.ok) {
      // If registration is successful, send a verification email
      const emailResponse = await fetch("http://localhost:8080/auth/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const emailData = await emailResponse.json();

      if (emailData && emailResponse.ok) {
        // If email is sent successfully, redirect to login page
        onRegistrationSuccess(values.email);
        localStorage.setItem("userEmail", values.email);
        onSubmitProps.resetForm();
      } else {
        setErrorMessage(emailData.error || "Error sending confirmation email. Check your email address.");
      }
    } else {
      setErrorMessage(savedUser.error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Register
      </Typography>
      {isLoading ? (
        <LoadingScreen />
      ) : (
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
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",  // Color of the label when input is focused
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
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",  // Color of the label when input is focused
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
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",  // Color of the label when input is focused
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
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",  // Color of the label when input is focused
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
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmPassword"
              error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword) && submitCount > 0}
              helperText={(touched.confirmPassword && errors.confirmPassword && submitCount > 0) ? errors.confirmPassword : ""}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              sx={{ 
                bgcolor: "#fbf2cf",
                "& label.Mui-focused": {
                  color: "#6b9466",  // Color of the label when input is focused
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

            {/* Error Message on invalid credentials or unsuccessfull login attempt */}
            {errorMessage && (
              <Typography variant="body2" sx={{ color: "red", fontWeight: "bold", mb: 2 }}>
                {errorMessage}
              </Typography>
            )}

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
      </Formik>)}
    </Container>
  );
};

export default RegisterForm;
