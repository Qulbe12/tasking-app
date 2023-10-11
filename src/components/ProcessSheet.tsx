import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import SheetModal from "../modals/SheetModal";
import { initSheetRecords } from "../redux/slices/sheetSlice";
import { Affix, Button, Group, Notification, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const ProcessSheet = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loaders, sheetRecords } = useAppSelector((state) => state.sheets);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(initSheetRecords());
  }, []);

  return (
    <div>
      <Affix position={{ bottom: 20, right: 20 }}>
        {loaders.processingSheet && (
          <Notification loading={true} disallowClose>
            Sheet Is Processing
          </Notification>
        )}

        {!loaders.processingSheet && sheetRecords.length > 0 && !showModal && (
          <Notification
            disallowClose
            className="cursor-pointer"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <Stack>
              <Text>Sheet is processed and ready to create</Text>
              <Group position="right">
                <Button
                  color="red"
                  onClick={() => {
                    setShowModal(false);
                    dispatch(initSheetRecords());
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button onClick={() => setShowModal(true)}>{t("createSheet")}</Button>
              </Group>
            </Stack>
          </Notification>
        )}
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
