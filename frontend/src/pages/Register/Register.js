import * as React from "react";
import "./register.css";
import Box from "@mui/material/Box";
import RegisterForm from "./RegisterForm";

function Register() {
  return (
    <Box>
      <Box
        // width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        // backgroundColor={theme.palette.background.alt}
      >
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default Register;

