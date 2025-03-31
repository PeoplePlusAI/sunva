import React from "react";

const ButtonComponent = ({
  componentFrom,
  title,
  buttonName,
  as,
  className,
  type,
  clickFunction,
  btnDisable,
  touchStart,
  mouseDown
}) => {

  return (
    <button
      as={as}
      type={type}
      className={`btn ${className}`}
      onClick={clickFunction}
      title={title}
      disabled={btnDisable}
      onTouchStart={touchStart}
      onMouseDown={mouseDown}
    >
      {buttonName}
    </button>
  );
};

export default ButtonComponent;
