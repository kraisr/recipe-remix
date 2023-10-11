import * as React from "react";
import { Box, useMediaQuery } from "@mui/material";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Logo from "../Navbar/Logo";
import EmailSent from "./EmailSent";

function ForgotPassword() {
  const [emailSent, setEmailSent] = React.useState(false); // Add state
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const handleEmailSent = () => {
    setEmailSent(true);
  };

  return (
    <Box>
      <Logo />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
      >
        {/* Conditionally render based on emailSent state */}
        {emailSent ? <EmailSent /> : <ForgotPasswordForm onEmailSent={handleEmailSent} />}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
