import classes from "./Footer.module.css";
import ImgIn from "../../assets/img/In.png";
import ImgGH from "../../assets/img/GH.png";

export function Footer() {
  return (
    <footer className={classes.footer}>
     
      <div className={classes.logos}>
        <p>Created by:</p>
        <div>
          <a href="https://github.com/olga-kacala" target="_blank" rel="noreferrer">
            <img
              title="My GH"
              alt="GitHub"
              src={ImgGH}
            />
          </a>
          <a href="https://www.linkedin.com/in/olga-kacala/" target="_blank" rel="noreferrer">
            <img
              title="My LinkedIn"
              alt="LinkedIn"
              src={ImgIn}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
