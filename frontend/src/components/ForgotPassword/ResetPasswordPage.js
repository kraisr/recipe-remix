import * as React from "react";
import { Box, useMediaQuery } from "@mui/material";
import ResetPasswordForm from "./ResetPasswordForm";
import Logo from "../Navbar/Logo";

function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;

