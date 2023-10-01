import { Image, Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import React, { useState } from "react";

type AvatarSelectProps = {
  handleAvatarChange: (files: FileWithPath[]) => void;
  image?: string | null;
};

const AvatarSelect: React.FC<AvatarSelectProps> = ({ handleAvatarChange, image }) => {
  const [hovered, setHovered] = useState(false);
  const [img, setImg] = useState<string | null>(null);

  return (
    <Dropzone
      pos={"relative"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      w="200px"
      onDrop={(files) => {
        setImg(URL.createObjectURL(files[0]));
        handleAvatarChange(files);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
    >
      <Image src={img || image} alt="image" />
      {hovered ? <Text>Drag image here or click to upload</Text> : ""}
    </Dropzone>
  );
};

export default AvatarSelect;
