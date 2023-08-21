import { Group, Badge, Divider, Button } from "@mantine/core";
import { IconCalendar } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { getAllThreads } from "../../../redux/api/nylasApi";
import { useAppDispatch } from "../../../redux/store";

type EmailListHeaderProps = {
  onActionButtonClick: () => void;
};

const EmailListHeader = ({ onActionButtonClick }: EmailListHeaderProps) => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("inbox");

  useEffect(() => {
    switch (type) {
      case "folder":
        dispatch(getAllThreads({ view: "expanded", limit: 1000 }));
        break;
      case "inbox":
        dispatch(getAllThreads({ view: "expanded", in: "Inbox", limit: 1000 }));
        break;

      case "sent":
        dispatch(getAllThreads({ view: "expanded", in: "Sent", limit: 1000 }));
        break;
      case "spam":
        dispatch(getAllThreads({ view: "expanded", in: "Spam", limit: 1000 }));
        break;
      case "trash":
        dispatch(getAllThreads({ view: "expanded", in: "Trash", limit: 1000 }));
        break;

      default:
        break;
    }
  }, [type]);

  return (
    <Group position="apart" my="md">
      <Group>
        <Badge
          variant={type === "folder" ? "filled" : "outline"}
          onClick={() => setType("folder")}
          style={{ cursor: "pointer" }}
        >
          Folder
        </Badge>

        <Divider orientation="vertical" />

        <Badge
          variant={type === "pending" ? "filled" : "outline"}
          onClick={() => setType("pending")}
          style={{ cursor: "pointer" }}
        >
          Pending
        </Badge>
        <Badge
          variant={type === "done" ? "filled" : "outline"}
          onClick={() => setType("done")}
          style={{ cursor: "pointer" }}
        >
          Done
        </Badge>
        <Badge
          variant={type === "all" ? "filled" : "outline"}
          onClick={() => setType("all")}
          style={{ cursor: "pointer" }}
        >
          All
        </Badge>

        <Divider orientation="vertical" />

        <Badge
          variant={type === "inbox" ? "filled" : "outline"}
          onClick={() => setType("inbox")}
          style={{ cursor: "pointer" }}
        >
          Inbox
        </Badge>
        <Badge
          variant={type === "sent" ? "filled" : "outline"}
          onClick={() => setType("sent")}
          style={{ cursor: "pointer" }}
        >
          Sent
        </Badge>
        <Badge
          variant={type === "spam" ? "filled" : "outline"}
          onClick={() => setType("spam")}
          style={{ cursor: "pointer" }}
        >
          Spam
        </Badge>
        <Badge
          variant={type === "trash" ? "filled" : "outline"}
          onClick={() => setType("trash")}
          style={{ cursor: "pointer" }}
        >
          Trash
        </Badge>
      </Group>
      <Button onClick={onActionButtonClick} leftIcon={<IconCalendar />}>
        Calendar
      </Button>
    </Group>
  );
};

export default EmailListHeader;
