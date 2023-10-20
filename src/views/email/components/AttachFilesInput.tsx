import { Group, Button, Card, ActionIcon, useMantineTheme, Text } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  FileWithPath,
} from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto, IconPaperclip, IconTrash, IconFile } from "@tabler/icons";
import { IconPdf } from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { nylasAxios } from "../../../config/nylasAxios";
import { IFile } from "../../../interfaces/nylas/IFile";
import { showError } from "../../../redux/commonSliceFunctions";

type AttachFilesInputProps = {
  uploadedAttachments: IFile[];
  handleRemoveAttachment: (attachment: IFile) => void;
  afterUpload: (attachment: IFile) => void;
};

const AttachFilesInput: React.FC<AttachFilesInputProps> = ({
  afterUpload,
  handleRemoveAttachment,
  uploadedAttachments,
}) => {
  const { t } = useTranslation();

  const theme = useMantineTheme();

  const openRef = useRef<() => void>(null);

  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "application/pdf":
        return <IconPdf />;

      default:
        return <IconFile />;
    }
  };
  const uploadAttachment = async (file: FileWithPath) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadingAttachment(true);
      const res = await nylasAxios.post<IFile[]>("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      afterUpload(res.data[0]);
    } catch (err) {
      console.log(err);
      showError("Something went wrong while uploading file");
    } finally {
      setUploadingAttachment(false);
    }
  };

  return (
    <Dropzone
      my="md"
      loading={uploadingAttachment}
      openRef={openRef}
      onDrop={(files) => {
        uploadAttachment(files[0]);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={3 * 1024 ** 2}
      activateOnClick={false}
      styles={{ inner: { pointerEvents: "all" } }}
      accept={[
        ...IMAGE_MIME_TYPE,
        ...MS_EXCEL_MIME_TYPE,
        ...MS_WORD_MIME_TYPE,
        ...PDF_MIME_TYPE,
        ...MS_POWERPOINT_MIME_TYPE,
      ]}
    >
      <Group>
        <Dropzone.Accept>
          <IconUpload
            size="2em"
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="2em"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="2em" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text inline>Drag attachments here or </Text>
        </div>
        <Button
          size="xs"
          variant="filled"
          leftIcon={<IconPaperclip size="1.2em" />}
          onClick={() => {
            openRef.current && openRef.current();
          }}
        >
          {t("addAttachment")}
        </Button>
      </Group>

      <Group>
        {uploadedAttachments.map((a) => {
          return (
            <Card key={a.id} withBorder my="md" p="xs">
              <Group>
                <TypeIcon type={a.content_type} />
                <Text>{a.filename}</Text>
                <ActionIcon color="red" onClick={() => handleRemoveAttachment(a)}>
                  <IconTrash size="1em" />
                </ActionIcon>
              </Group>
            </Card>
          );
        })}
      </Group>
    </Dropzone>
  );
};

export default AttachFilesInput;
