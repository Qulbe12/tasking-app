import React, { useEffect, useState } from "react";
import CommonModalProps from "./CommonModalProps";
import { IDocument } from "hexa-sdk";
import { ActionIcon, Button, Flex, Group, Modal, Paper, Text } from "@mantine/core";
import CustomDropzone from "../components/CustomDropzone";
import { FileWithPath } from "@mantine/dropzone";
import { showError } from "../redux/commonSliceFunctions";
import { IconX } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addDocumentFiles } from "../redux/api/documentApi";

type AddDocumentFilesModalProps = {
  document?: IDocument | null;
} & CommonModalProps;

const AddDocumentFilesModal = ({ onClose, opened, document }: AddDocumentFilesModalProps) => {
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.documents);

  const [attachments, setAttachments] = useState<FileWithPath[]>([]);

  useEffect(() => {
    setAttachments([]);
  }, [opened]);

  const handleAdd = async () => {
    if (!document) return;

    const formData = new FormData();
    attachments.forEach((a) => {
      formData.append("files", a);
    });
    await dispatch(
      addDocumentFiles({
        documentId: document.id,
        attachment: formData,
      }),
    );
    onClose();
  };

  return (
    <Modal onClose={onClose} opened={opened} title={`Add files to ${document?.title}`}>
      {Array.from(attachments).map((f, i) => {
        return (
          <Flex key={f.name} justify="space-between" align="center">
            <Text lineClamp={1}>{f.name}</Text>
            <ActionIcon
              color={"red"}
              size="sm"
              onClick={() => {
                setAttachments((a) => a.filter((_, index) => index !== i));
              }}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        );
      })}

      <Paper my="md" />
      <CustomDropzone
        disabled={!!loaders.updating}
        onDrop={(files) => {
          if (attachments.length < 10) {
            setAttachments((a) => [...a, ...files]);
          } else {
            showError("You can only attach 10 files");
          }
        }}
      />

      <Group mt="md">
        <Button loading={!!loaders.updating} onClick={handleAdd}>
          Add Files
        </Button>
      </Group>
    </Modal>
  );
};

export default AddDocumentFilesModal;
