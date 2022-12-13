import React from "react";
import ThemeToggle from "./ThemeToggle";
import UserButton from "./UserButton";

const Header = () => {
  return (
    <div className="flex justify-end items-center h-full gap-4">
      <UserButton />
    </div>
  );
};

export default Header;
