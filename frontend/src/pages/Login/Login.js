import * as React from "react";
import "./login.css";
import { Box, useMediaQuery } from "@mui/material";
import LoginForm from "./LoginForm";
import Logo from "../../components/Navbar/Logo";

function Login() {
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
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Login;

