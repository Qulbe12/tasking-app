import React from "react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconX, IconFile } from "@tabler/icons";
import { Dropzone, DropzoneProps, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useTranslation } from "react-i18next";

type CustomDropzoneProps = {
  isSheet?: boolean;
};

const CustomDropzone = (props: Partial<DropzoneProps> & CustomDropzoneProps) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  return (
    <Dropzone
      maxSize={props.isSheet ? undefined : 3 * 1024 ** 2}
      accept={PDF_MIME_TYPE}
      onDrop={function (files: FileWithPath[]): void {
        props.onDrop?.(files);
      }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: props.isSheet ? "80vh" : 20, pointerEvents: "none" }}
      >
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
            {t("dragDocument")}
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            {props.isSheet ? t("attachPdf") : t("attachMany")}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default CustomDropzone;
