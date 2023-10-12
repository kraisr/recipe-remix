import React, { useState } from "react";
import Box from "@mui/material/Box";
import RegisterForm from "./RegisterForm";
import Logo from "../../components/Navbar/Logo";
import EmailSent from "./EmailSent";  // Import the EmailSentConfirmation component

function Register() {
  const [isRegistered, setIsRegistered] = useState(false);  // State to manage if the email is sent
  const [userEmail, setUserEmail] = useState("");  

  const handleRegistrationSuccess = (email) => {  // Function to change the state when email is sent
    setIsRegistered(true);
    setUserEmail(email);
  };

  return (
    <Box>
      <Logo />
      <Box
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
      >
        {/* Conditional rendering based on whether the email is sent or not */}
        {!isRegistered ? (
          <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />  // Pass the handleRegistrationSuccess function as prop
        ) : (
          <EmailSent email={userEmail} />  // Render the email sent confirmation component upon email sent
        )}
      </Box>
    </Box>
  );
};

export default Register;
