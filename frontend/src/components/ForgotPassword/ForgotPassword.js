import * as React from "react";
// import "./login.css";
import { Box, useMediaQuery } from "@mui/material";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Logo from "../Navbar/Logo";

function ForgotPassword() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Logo />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
      >
        <ForgotPasswordForm />
      </Box>
    </Box>
  );
};

export default ForgotPassword;

