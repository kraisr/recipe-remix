import * as React from 'react';
import "../css/login.css";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

// function Login() {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   return (
//     // <div>
//     //   <button onClick={() => window.location.href='/auth/google'}>Login with Google</button>
//     //   <button onClick={() => window.location.href='/auth/facebook'}>Login with Facebook</button>
//     // </div>
//     <div className="container">
//       <div className="login">
//         <Box
//           component="form"
//           sx={{
//             '& > :not(style)': { m: 1, width: '25ch' },
//           }}
//           noValidate
//           autoComplete="off"
//         >
//           {/* <TextField id="input-with-sx" label="Username or email" variant="filled" /> */}
//           <TextField
//           id="outlined-username-input"
//           label="Username"
//           type="username"
//           autoComplete="current-username"
//           />
//           <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
//             <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
//             <OutlinedInput
//               id="outlined-adornment-password"
//               type={showPassword ? 'text' : 'password'}
//               endAdornment={
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={handleClickShowPassword}
//                     onMouseDown={handleMouseDownPassword}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               }
//               label="Password"
//             />
//           </FormControl>
//           {/* <TextField id="filled-basic" label="Password" variant="filled" /> */}
//           {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
//             <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
//             <TextField id="input-with-sx" label="With sx" variant="standard" />
//           </Box> */}
//           <Button variant="contained" style={{backgroundColor: '#fa7070', color: '#fff'}}>Log in</Button>
//         </Box>
//       </div>
//     </div>
//   );
// }

// export default Login;

const Login = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Sociopedia
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Socipedia, the Social Media for Sociopaths!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default Login;