import * as React from "react";
import logoImg from "../../images/logo.png";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <div class="logo"> <img alt="logo" src={logoImg}/> </div>
    </Link>
  );
};

export default Logo;

