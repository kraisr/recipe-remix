import React from 'react';

function Login() {
  return (
    <div>
      <button onClick={() => window.location.href='/auth/google'}>Login with Google</button>
      <button onClick={() => window.location.href='/auth/facebook'}>Login with Facebook</button>
    </div>
  );
}

export default Login;
