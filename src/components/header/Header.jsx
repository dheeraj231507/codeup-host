import React from "react";
import "../header/custom.css";

function Header() {
  return (
    <div className="flex justify-between items-center  custom-flex">
      <img
        src="/image1.png
    "
        alt="logo"
        className="logo"
      />

      <img src="/image2.png" alt="menu" className="  menu  " />
    </div>
  );
}

export default Header;
