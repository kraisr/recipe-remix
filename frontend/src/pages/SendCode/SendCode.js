import React, { useState, useEffect } from "react";
import { generatePath, useNavigate } from 'react-router-dom';
import ReactCodeInput from "react-verification-code-input";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import { useLocation } from "react-router-dom";
import "./sendcode.css";


const SendCode = () => {
  const [enteredCode, setEnteredCode] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  let [createdCode, setCreatedCode] = useState("");

  const location = useLocation();
  const loggedIn = location.state.loggedIn;
  const dispatch = useDispatch();

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
      dispatch(
        setLogin({
          token: loggedIn.token,
          user: loggedIn.user,
        })
      );
      navigate('/');
    }
    else {
      window.alert('Verification failed');
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
              onChange={handleVerificationCodeChange}
              fieldWidth={40}
              // fieldHeight={100}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2,
                mb:2,
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
             
            
            <div className="noCode">
                Didn't receive the code?<br />
                <a onClick={sendVerificationCode}> Resend Code</a><br />
                {/* <a href="#">Change phone number</a> */}
            </div>
            
        </div>
    </div>
  );
};

export default SendCode;
