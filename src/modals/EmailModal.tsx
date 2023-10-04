import {
  Stack,
  Input,
  Flex,
  Button,
  Drawer,
  Divider,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
  Group,
  Text,
  Checkbox,
  Badge,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { nylasAxios } from "../config/nylasAxios";
import { ICreateEmail } from "../interfaces/ICreateEmail";
import { showError } from "../redux/commonSliceFunctions";
import { useAppSelector } from "../redux/store";
import { generateDocumentColor } from "../utils/generateDocumentColor";
import CommonModalProps from "./CommonModalProps";
import { showNotification } from "@mantine/notifications";
import CustomTextEditor from "../components/CustomTextEditor";
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";

type EmailModalProps = {
  selectedDocument?: IDocumentResponse | null;
};

const EmailModal = ({ opened, onClose, selectedDocument }: CommonModalProps & EmailModalProps) => {
  const { data } = useAppSelector((state) => state.documents);

  const [form, setForm] = useState<ICreateEmail>({
    body: "",
    subject: "",
    to: [
      {
        email: "",
        name: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<TransferListData>([[], []]);

  useEffect(() => {
    const otherDocuments = data
      .filter((d) => d.id !== selectedDocument?.id)
      .map((d) => ({
        value: d.id,
        label: d.title,
        ...d,
      }));

    const selectedData = selectedDocument
      ? [
          {
            label: selectedDocument.title,
            value: selectedDocument.id,
            ...selectedDocument,
          },
        ]
      : [];

    setDocuments([otherDocuments, selectedData]);
  }, [data, selectedDocument]);

  const ItemComponent: TransferListItemComponent = ({
    data,
    selected,
  }: TransferListItemComponentProps) => (
    <Group noWrap>
      <Checkbox checked={selected} tabIndex={-1} sx={{ pointerEvents: "none" }} />
      <div style={{ flex: 1 }}>
        <Text size="sm" weight={500}>
          {data.label}
        </Text>
        <Text size="xs" color="dimmed" weight={400}>
          {data.description}
        </Text>
      </div>
      <Badge color={generateDocumentColor(data.template.name)} mb="sm">
        {data.template.name}
      </Badge>
    </Group>
  );

  return (
    <Drawer
      title="Compose Email"
      padding={"md"}
      size="70%"
      position="right"
      opened={opened}
      onClose={onClose}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          let newSubject = form.subject;

          try {
            let newBody: string = JSON.parse(JSON.stringify(form.body));

            newBody += "<br />";

            if (documents.length > 0) {
              newSubject += " - [";
              newBody += "<p>Linked Documents:</p>";
            }

            documents[1].forEach((d) => {
              const foundDocument = data.find((doc) => doc.id === d.value);
              newSubject += `${foundDocument?.type}: ${foundDocument?.id}, `;
              newBody += `<a href=${"https://hexadesk.ca/documents/" + d.value} type=${
                foundDocument?.type
              }>${d.label}</a><br />`;
            });

            if (documents.length > 0) {
              newSubject += "]";
            }

            await nylasAxios.post("/send", { ...form, subject: newSubject, body: newBody });
            showNotification({
              message: "Message Sent Successfully",
              color: "indigo",
            });
            setForm({ body: "", subject: "", to: [{ email: "", name: "" }] });
            onClose();
            setLoading(false);
          } catch (err: any) {
            setLoading(false);
            showError(err.message);
          }
        }}
      >
        <Stack spacing={"md"}>
          <Input
            width="100%"
            value={form.to[0].email}
            placeholder="To"
            onChange={(e) => {
              setForm((f) => {
                return {
                  ...f,
                  to: [{ name: e.target.value, email: e.target.value }],
                };
              });
            }}
          />

          <Input
            variant="default"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />

          <CustomTextEditor
            content={form.body}
            onUpdate={(content) => {
              setForm({ ...form, body: content });
            }}
          />

          <Divider label="Attach Documents" />

          <TransferList
            value={documents}
            onChange={setDocuments}
            itemComponent={ItemComponent}
            searchPlaceholder="Search..."
            nothingFound="Nothing here"
            titles={["Available", "In-Email"]}
            showTransferAll={false}
            breakpoint="sm"
            filter={(query, item) => JSON.stringify(item).includes(query.toLowerCase().trim())}
          />

          <Flex justify={"end"} gap={"md"}>
            <Button type="submit" loading={loading}>
              Send
            </Button>
          </Flex>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EmailModal;
