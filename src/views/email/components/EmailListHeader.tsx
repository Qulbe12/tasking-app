import React from "react";
import { Group, Button } from "@mantine/core";
import { IconCalendar } from "@tabler/icons";

type EmailListHeaderProps = {
  onActionButtonClick: () => void;
  onTypeChange: (type: string) => void;
  type: string;
};

const EmailListHeader = ({ onActionButtonClick }: EmailListHeaderProps) => {
  return (
    <Group position="right" my="md">
      {/* <Group> */}
      {/*   <Badge */}
      {/*     variant={type === "folder" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("folder")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Folder */}
      {/*   </Badge> */}

      {/*   <Divider orientation="vertical" /> */}

      {/*   <Badge */}
      {/*     variant={type === "pending" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("pending")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Pending */}
      {/*   </Badge> */}
      {/*   <Badge */}
      {/*     variant={type === "done" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("done")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Done */}
      {/*   </Badge> */}
      {/*   <Badge */}
      {/*     variant={type === "all" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("all")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     All */}
      {/*   </Badge> */}

      {/*   <Divider orientation="vertical" /> */}

      {/*   <Badge */}
      {/*     variant={type === "inbox" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("inbox")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Inbox */}
      {/*   </Badge> */}
      {/*   <Badge */}
      {/*     variant={type === "sent" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("sent")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Sent */}
      {/*   </Badge> */}
      {/*   <Badge */}
      {/*     variant={type === "spam" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("spam")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Spam */}
      {/*   </Badge> */}
      {/*   <Badge */}
      {/*     variant={type === "trash" ? "filled" : "outline"} */}
      {/*     onClick={() => onTypeChange("trash")} */}
      {/*     style={{ cursor: "pointer" }} */}
      {/*   > */}
      {/*     Trash */}
      {/*   </Badge> */}
      {/* </Group> */}
      <Button onClick={onActionButtonClick} leftIcon={<IconCalendar />}>
        Calendar
      </Button>
    </Group>
  );
};

export default EmailListHeader;
