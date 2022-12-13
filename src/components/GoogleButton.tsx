import { Button, ButtonProps } from "@mantine/core";
import React from "react";
import { GoogleIcon } from "../assets/icons/GoogleIcon";

const GoogleButton = (props: ButtonProps) => {
  return <Button leftIcon={<GoogleIcon />} variant="filled" color="gray" {...props} />;
};

export default GoogleButton;
