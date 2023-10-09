import * as React from "react";
import "./login.css";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import Logo from "../../components/Navbar/Logo";

function Login() {
  return (
    <Box>
      <Logo />
      <Box
        // width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        // backgroundColor={theme.palette.background.alt}
      >
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Login;

