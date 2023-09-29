import React, { useState } from "react";
import SheetModal from "../modals/SheetModal";
import { Affix, Notification, Stack } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { initSheetRecords } from "../redux/slices/sheetSlice";

const ProcessSheet = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const {
    loaders: { processingSheet },
    sheetRecords,
  } = useAppSelector((state) => state.sheets);

  return (
    <div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Stack>
          {processingSheet && (
            <Notification
              onClick={() => {
                if (!processingSheet) {
                  setShowModal(true);
                }
              }}
              disallowClose={true}
              title={"Processing Sheet"}
              loading={processingSheet}
            />
          )}

          {!showModal && sheetRecords.length > 0 && (
            <Notification
              className="hover:cursor-pointer"
              onClick={() => {
                if (!processingSheet) {
                  setShowModal(true);
                }
              }}
              disallowClose={false}
              title={"Sheet processed."}
              loading={processingSheet}
            >
              Sheet successfully processed, please click here to create it.
            </Notification>
          )}
        </Stack>
      </Affix>

      <SheetModal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
          dispatch(initSheetRecords());
        }}
      />
    </div>
  );
};

export default ProcessSheet;
