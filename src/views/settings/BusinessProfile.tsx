import { Button, Card, Image, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { axiosPrivate } from "../../config/axios";

const BusinessProfile = () => {
  const { t } = useTranslation();
  const { businessInfo } = useAppSelector((state) => state.business);

  const [hovered, setHovered] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Paper mt="md">
      <Card>
        <Title mb="md" order={4}>
          {t("updateBusinessProfile")}
        </Title>
        <Stack>
          {loading ? "Loading" : ""}
          <Dropzone
            pos={"relative"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            w="200px"
            onDrop={async (files) => {
              try {
                setLoading(true);
                const formData = new FormData();
                formData.append("file", files[0]);
                const res = await axiosPrivate.patch("/business/logo", formData);
                console.log(res.data);
              } catch (err) {
                console.log(err);
              } finally {
                setLoading(false);
              }
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Image src={businessInfo?.companyLogoUrl} />
            {hovered ? <Text>Drag image here or click to upload</Text> : ""}
          </Dropzone>
          <TextInput
            label={t("businessName")}
            withAsterisk
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <TextInput
            label={t("jobTitle")}
            withAsterisk
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <Button loading={false}>{t("update")}</Button>
        </Stack>
      </Card>
    </Paper>
  );
};

export default BusinessProfile;
