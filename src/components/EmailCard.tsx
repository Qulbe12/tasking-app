import { Card, Loader, Text } from "@mantine/core";
import React, { useState } from "react";
import { IEmailResponse, IEmailThreadResponse } from "../interfaces/IEmailResponse";
import { useDisclosure } from "@mantine/hooks";
import EmailDetailsModal from "../modals/EmailDetailsModal";
import getEmailsByThreadId from "../utils/getEmailsByThreadId";

type EmailCardProps = {
  email: IEmailThreadResponse;
};

const EmailCard = ({ email }: EmailCardProps) => {
  const [showEmailModal, { toggle }] = useDisclosure(false);

  const [threadEmails, setThreadEmails] = useState<IEmailResponse[] | null>(null);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer relative"
        onClick={async () => {
          setLoading(true);
          const res = await getEmailsByThreadId(email.id);

          setThreadEmails(res.data);
          setLoading(false);
          toggle();
        }}
        withBorder
        shadow="sm"
      >
        {loading && <Loader size="sm" className="absolute top-4 right-4" />}
        <Text weight="bold">{email.subject.split("- [")[0]}</Text>
        <Text>{email.snippet}</Text>
      </Card>
      <EmailDetailsModal
        emails={threadEmails}
        onClose={toggle}
        opened={showEmailModal}
        title={email.subject.split("- [")[0]}
      />
    </>
  );
};

export default EmailCard;
