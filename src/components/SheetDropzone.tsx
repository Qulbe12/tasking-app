import React, { useRef } from "react";
import { Button, Card, Center, Group, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconX, IconFile } from "@tabler/icons";
import { Dropzone, DropzoneProps, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";

const SheetDropzone = (props: Partial<DropzoneProps>) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <>
      <Dropzone.FullScreen
        openRef={openRef}
        accept={PDF_MIME_TYPE}
        onDrop={function (files: FileWithPath[]): void {
          props.onDrop?.(files);
        }}
      >
        <Group position="center" spacing="xl">
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
              Drag and drop document here
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach a sheet type pdf file
            </Text>
          </div>
        </Group>
      </Dropzone.FullScreen>

      <Card h="80vh" withBorder>
        <Center h="100%">
          <div>
            <Text size="xl" inline>
              Drag and drop document here
            </Text>
            <Button
              onClick={() => {
                if (openRef.current) {
                  openRef.current();
                }
              }}
              variant="subtle"
              size="sm"
              color="dimmed"
              mt={7}
            >
              Or attach a sheet type pdf file
            </Button>
          </div>
        </Center>
      </Card>
    </>
  );
};

export default SheetDropzone;
