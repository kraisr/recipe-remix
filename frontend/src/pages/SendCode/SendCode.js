import React, { useState, useEffect } from "react";
import ReactCodeInput from "react-verification-code-input";
import { Button, TextField, Container, Typography, InputAdornment, IconButton, Box } from "@mui/material";
import "./sendcode.css";

const SendCode = () => {


  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState(null);

  const getUserEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch("http://localhost:8080/user/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email);
      } else {
        console.error("Failed to fetch user email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate a random 6-digit code
  useEffect(() => {
    getUserEmail(); // Fetch the user's email

    // Generate a random 6-digit code
    const generateRandomCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      sendVerificationCode(verificationCode);
    };
    generateRandomCode();

    
  }, []); 


  const handleVerificationCodeChange = (code) => {
    // Handle the verification code change if needed
  };

  const sendVerificationCode = async (code) => {
    try {
      
      const response = await fetch("http://localhost:8080/user/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(code),
      });

      if (response.ok) {
        console.log("Code verification successful!");
      } else {
        console.error("Error verifying code:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
    
  return (
    <div id="wrapper">
        <div id="dialog">
            <button class="close">×</button>
            <h3>Please enter the 6-digit verification code we sent via SMS:</h3>
            <span>(we want to make sure it's you before we contact our movers)</span>
            
            <ReactCodeInput 
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                  mt: 1, 
                  backgroundColor: "#fa7070",
                  color: "#fff",
                  "&:hover": {
                      backgroundColor: "#e64a4a",  // Darker red on hover
                  }
              }}
            />
            <div>
                Didn't receive the code?<br />
                <a href="#">Send code again</a><br />
                <a href="#">Change phone number</a>
            </div>
            
        </div>
    </div>
  );
};

export default SendCode;
