import * as React from "react";
import { Box, useMediaQuery } from "@mui/material";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetSuccess from "./ResetSuccess";  // Import the component
import Logo from "../Navbar/Logo";

function ResetPasswordPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [resetSuccess, setResetSuccess] = React.useState(false); // Add state

  return (
    <Box>
      <Logo />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
      >
        {resetSuccess ? <ResetSuccess /> : <ResetPasswordForm onResetSuccess={() => setResetSuccess(true)} />}
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
