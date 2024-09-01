import React from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header>
      <Link to="/">
        <h1>
          Byte W<span className={classes.orange}>a</span>rs: <br />
          AI vs Hum<span className={classes.gray}>a</span>ns
        </h1>
      </Link>
    </header>
  );
}
