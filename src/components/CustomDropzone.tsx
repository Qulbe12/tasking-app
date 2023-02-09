import React from "react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconX, IconFile } from "@tabler/icons";
import { Dropzone, DropzoneProps, PDF_MIME_TYPE } from "@mantine/dropzone";

const CustomDropzone = (props: Partial<DropzoneProps>) => {
  const theme = useMantineTheme();

  return (
    <Dropzone
      onDrop={
        props.onDrop
          ? props.onDrop
          : () => {
              // TODO: Something must go here
            }
      }
      onReject={(files) => {
        console.log("Rejected Files", files);
      }}
      maxSize={3 * 1024 ** 2}
      accept={PDF_MIME_TYPE}
      {...props}
    >
      <Group position="center" spacing="xl" style={{ minHeight: 20, pointerEvents: "none" }}>
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFile size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag documents here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default CustomDropzone;
