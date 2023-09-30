import React from "react";
import CommonModalProps from "./CommonModalProps";
import { Modal } from "@mantine/core";
import SheetDropzone from "../components/SheetDropzone";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { processSheet } from "../redux/api/sheetsApi";

const SheetProcessModal = ({ onClose, opened }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { activeBoard } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
      }}
      fullScreen
    >
      <SheetDropzone
        onDrop={async (file) => {
          if (!activeBoard) return;
          if (!activeWorkspace) return;
          dispatch(processSheet({ file, activeBoard: activeBoard.id, activeWorkspace: "" }));
          onClose();
        }}
      />
    </Modal>
  );
};

export default SheetProcessModal;
