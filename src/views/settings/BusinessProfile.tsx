import { Button, Card, Image, Paper, Skeleton, Stack, Text, TextInput, Title } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { axiosPrivate } from "../../config/axios";
import { getBusinessInfo, updateBusinessInfo } from "../../redux/api/businessApi";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";

const BusinessProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    businessInfo,
    loaders: { gettingBusinessInfo, updatingBusinessInfo },
  } = useAppSelector((state) => state.business);

  const [hovered, setHovered] = useState(false);

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getBusinessInfo());
  }, []);

  const schema = yup.object({
    name: yup.string().required(),
    jobTitle: yup.string().required(),
  });

  const form = useForm({
    initialValues: {
      name: "",
      jobTitle: "",
    },
    validate: yupResolver(schema),
  });

  const handleAvatarChange = useCallback(async (files: FileWithPath[]) => {
    try {
      setImage(URL.createObjectURL(files[0]));
      const formData = new FormData();
      formData.append("file", files[0]);
      await axiosPrivate.patch("/business/logo", formData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (values: typeof form.values) => {
      await dispatch(updateBusinessInfo({ values }));
      form.reset();
    },
    [businessInfo],
  );

  if (gettingBusinessInfo) {
    return (
      <Stack>
        <Skeleton h={500} />
      </Stack>
    );
  }

  return (
    <Paper mt="md">
      <Card>
        <Title mb="md" order={4}>
          {t("updateBusinessProfile")}
        </Title>
        <Stack>
          <Dropzone
            pos={"relative"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            w="200px"
            onDrop={handleAvatarChange}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Image src={image || businessInfo?.companyLogoUrl} />
            {hovered ? <Text>Drag image here or click to upload</Text> : ""}
          </Dropzone>
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Stack>
              <TextInput
                placeholder={businessInfo?.name}
                label={t("businessName")}
                withAsterisk
                {...form.getInputProps("name")}
              />
              <TextInput
                placeholder={businessInfo?.jobTitle}
                label={t("jobTitle")}
                withAsterisk
                {...form.getInputProps("jobTitle")}
              />
              {form.isDirty() && (
                <Button loading={updatingBusinessInfo} type="submit">
                  {t("update")}
                </Button>
              )}
            </Stack>
          </form>
        </Stack>
      </Card>
    </Paper>
  );
};

export default BusinessProfile;
