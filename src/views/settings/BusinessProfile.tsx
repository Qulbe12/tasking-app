import { Button, Card, Paper, Skeleton, Stack, TextInput, Title } from "@mantine/core";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FileWithPath } from "@mantine/dropzone";
import { axiosPrivate } from "../../config/axios";
import { getBusinessInfo, updateBusinessInfo } from "../../redux/api/businessApi";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import AvatarSelect from "../../components/AvatarSelect";

const BusinessProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    businessInfo,
    loaders: { gettingBusinessInfo, updatingBusinessInfo },
  } = useAppSelector((state) => state.business);

  useEffect(() => {
    dispatch(getBusinessInfo());
  }, []);

  const schema = yup.object({
    name: yup.string(),
    jobTitle: yup.string(),
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
      const formData = new FormData();
      formData.append("file", files[0]);
      await axiosPrivate.patch("/business/logo", formData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (values: typeof form.values) => {
      const newForm = {
        name: values.name || businessInfo?.name || "",
        jobTitle: values.jobTitle || businessInfo?.jobTitle || "",
      };

      console.log(newForm);

      await dispatch(updateBusinessInfo({ values: newForm }));
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
          <AvatarSelect
            image={businessInfo?.companyLogoUrl}
            handleAvatarChange={handleAvatarChange}
          />
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
