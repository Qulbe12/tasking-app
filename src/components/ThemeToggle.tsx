import { ActionIcon } from "@mantine/core";
import { IconBrightnessDown, IconMoonStars } from "@tabler/icons";
import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { toggleTheme } from "../redux/slices/themeSlice";

const iconSize = 100;

const ThemeToggle = () => {
  const { mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  return (
    <ActionIcon size="xl" onClick={() => dispatch(toggleTheme())}>
      {mode === "dark" ? <IconBrightnessDown size={iconSize} /> : <IconMoonStars size={iconSize} />}
    </ActionIcon>
  );
};

export default ThemeToggle;
