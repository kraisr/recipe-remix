import React, { useState, useEffect } from "react";
import { generatePath, useNavigate } from 'react-router-dom';
import ReactCodeInput from "react-verification-code-input";
import { Button } from "@mui/material";
import "./sendcode.css";

const SendCode = () => {
  const [enteredCode, setEnteredCode] = useState(null);
  let [createdCode, setCreatedCode] = useState("");
  let dumbCode = null;
  const navigate = useNavigate();
  const handleXButtonClick = () => {
    // Navigate back to the login page
      navigate('/login');
  };

  // Generate a random 6-digit code
  useEffect(() => {
    // getUserEmail(); // Fetch the user's email

    // Generate a random 6-digit code
    const generateRandomCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("test: ", code);
      setVerificationCode(code);
      sendVerificationCode(verificationCode);
    };
    
    generateRandomCode();

  }, []); 

  const handleVerificationCodeChange = (code) => {
    // Update the verification code when it changes
    setEnteredCode(code);
    console.log("code: ", enteredCode);
  };

  //check code
  const checkCode = () => {
    console.log("created code:", createdCode);
    console.log('entered code:', enteredCode);
    if (enteredCode === createdCode){
      navigate('/');
    }
    else {
      console.log('bad');
    }
  }

  const sendVerificationCode = async () => {
    try {

      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setCreatedCode(code);

      const requestBody = {
        code: code
      };
      
      const response = await fetch("http://localhost:8080/user/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody),
      });
      console.log(response.body);
      const responseData = await response.json();
      console.log('Server response:', responseData);

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
            <button class="close" onClick={handleXButtonClick}>x</button>
            <h3>Please enter the 6-digit verification code we sent via Email:</h3>
           
            
            <ReactCodeInput 
              type="text"
              className="codeInput"
              // onComplete={checkCode}
              onChange={handleVerificationCodeChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 0.5,
                height: 50,
                width:100,
                backgroundColor: "#fa7070",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#e64a4a",
                }
              }}
              onClick={checkCode}
            >
            Verify
            </Button>
             
            
            <div>
                Didn't receive the code?<br />
                <a href="#">Send code again</a><br />
                {/* <a href="#">Change phone number</a> */}
            </div>
            
        </div>
    </div>
  );
};

export default SendCode;
