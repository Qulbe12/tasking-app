import { showNotification, cleanNotificationsQueue } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import SheetModal from "../modals/SheetModal";
import { initSheetRecords } from "../redux/slices/sheetSlice";

const ProcessSheet = () => {
  const dispatch = useAppDispatch();
  const { loaders, sheetRecords } = useAppSelector((state) => state.sheets);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cleanNotificationsQueue();
    if (loaders.processingSheet) {
      showNotification({
        message: "Sheet is processing",
        autoClose: false,
        loading: true,
      });
    }

    if (!loaders.processingSheet && sheetRecords.length > 0) {
      showNotification({
        message: "Sheet is processed and ready to create",
        autoClose: false,
        children: <h1>Hello</h1>,
        onClick: () => {
          setShowModal(true);
          cleanNotificationsQueue();
        },
      });
    }
  }, [loaders.processingSheet]);

  useEffect(() => {
    dispatch(initSheetRecords());
  }, []);

  return (
    <div>
      <SheetModal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
          cleanNotificationsQueue();
        }}
      />
    </div>
  );
};

export default ProcessSheet;
