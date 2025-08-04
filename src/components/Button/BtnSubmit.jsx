import React from "react";

const BtnSubmit = ({ children }) => {
  return (
    <button className="mt-4 bg-primary text-white text-sm px-6 py-2 rounded hover:bg-secondary transition-all duration-300 cursor-pointer">
      {children}
    </button>
  );
};

export default BtnSubmit;
