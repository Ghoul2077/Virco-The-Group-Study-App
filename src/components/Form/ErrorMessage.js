import React from "react";

const ErrorMessage = ({ error, visible, className = "" }) => {
  if (!error || !visible) return null;
  return (
    <div className={`text-bold my-2 text-center ${className}`}>{error}</div>
  );
};

export default ErrorMessage;
