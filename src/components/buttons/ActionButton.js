import React from "react";

export default function ActionButton({ 
  onClick, 
  children, 
  variant = "primary", // primary, secondary, danger
  style = {},
  ...props 
}) {
  const getButtonStyle = () => {
    const baseStyle = {
      height: "30px",
      borderRadius: "10px",
      border: "none",
      width: "100px",
      cursor: "pointer",
      ...style
    };

    switch (variant) {
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: "rgba(213, 213, 210, 0.8)",
          color: "black",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: "white",
          color: "red",
        };
      case "primary":
      default:
        return {
          ...baseStyle,
          backgroundColor: "rgba(23, 115, 185, 1)",
          color: "white",
        };
    }
  };

  return (
    <button
      onClick={onClick}
      style={getButtonStyle()}
      {...props}
    >
      {children}
    </button>
  );
}
