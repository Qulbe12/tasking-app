import {
  Stack,
  Button,
  Divider,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
  Group,
  Text,
  Checkbox,
  Badge,
  Card,
  TextInput,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";

import CustomTextEditor from "../../../components/CustomTextEditor";
import { showError } from "../../../redux/commonSliceFunctions";
import { generateDocumentColor } from "../../../utils/generateDocumentColor";
import { IconSend, IconTrash } from "@tabler/icons";
import { IMessageResponse } from "../../../interfaces/nylas/IMessageResponse";
import { useAppDispatch } from "../../../redux/store";
import { sendMessage } from "../../../redux/api/nylasApi";
import { ISendMessage } from "../../../interfaces/nylas/ISendMessage";

type ComposeEmailProps = {
  onCancelClick: () => void;
  selectedMessage?: IMessageResponse;
};

const ComposeEmail = ({ onCancelClick, selectedMessage }: ComposeEmailProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ISendMessage>({
    body: "",
    subject: "",
    cc: [
      {
        email: "",
        name: "",
      },
    ],
    to: [
      {
        email: "",
        name: "",
      },
    ],
  });

  useEffect(() => {
    if (!selectedMessage) return;
    let newSubject = selectedMessage.subject;

    if (!selectedMessage.subject.includes("Re:")) {
      newSubject = "Re: " + selectedMessage.subject;
    }

    setForm({ ...form, subject: newSubject, body: selectedMessage.body });
  }, [selectedMessage]);

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<TransferListData>([[], []]);

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
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          await dispatch(sendMessage(form));
          setForm({
            body: "",
            subject: "",
            to: [{ email: "", name: "" }],
            cc: [{ email: "", name: "" }],
            bcc: [{ email: "", name: "" }],
          });

          onCancelClick();
          setLoading(false);
        } catch (err: any) {
          setLoading(false);
          showError(err.message);
        }
      }}
    >
      <Stack spacing={"md"}>
        <TextInput
          label="To"
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
        <TextInput
          label="CC"
          width="100%"
          value={form.cc ? form.cc[0].email : ""}
          placeholder="To"
          onChange={(e) => {
            setForm((f) => {
              return {
                ...f,
                cc: [{ name: e.target.value, email: e.target.value }],
              };
            });
          }}
        />

        <TextInput
          label="BCC"
          width="100%"
          value={form.bcc ? form.bcc[0].email : ""}
          placeholder="To"
          onChange={(e) => {
            setForm((f) => {
              return {
                ...f,
                bcc: [{ name: e.target.value, email: e.target.value }],
              };
            });
          }}
        />

        <TextInput
          label="Subject"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        {!selectedMessage ? (
          <CustomTextEditor
            content={form.body}
            onUpdate={(content) => {
              setForm({ ...form, body: content });
            }}
          />
        ) : (
          <Card>
            <Flex gap="md">
              <Divider orientation="vertical" size="xl" />
              <div dangerouslySetInnerHTML={{ __html: selectedMessage.body }}></div>
            </Flex>
          </Card>
        )}
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
        <Group position="right">
          <Button
            leftIcon={<IconTrash size="1em" />}
            onClick={onCancelClick}
            type="button"
            color="red"
            loading={loading}
          >
            Cancel
          </Button>
          <Button leftIcon={<IconSend size="1em" />} type="submit" loading={loading}>
            Send
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ComposeEmail;
