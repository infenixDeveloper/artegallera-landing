import React from "react";
import "./Button.css";

const Button = ({ icon, variant, title, ...rest }) => {
  return (
    <button className={`button__container ${variant}`} {...rest}>
      <span className="button__icon">
        <img src={icon} alt="" />
      </span>
      <span className="button__title">{title}</span>
    </button>
  );
};

export default Button;
