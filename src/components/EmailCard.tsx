import { Card, Loader, Text } from "@mantine/core";
import React, { useState } from "react";
import { IEmailResponse, IEmailThreadResponse } from "../interfaces/IEmailResponse";
import { useDisclosure } from "@mantine/hooks";
import EmailDetailsModal from "../modals/EmailDetailsModal";
import getEmailsByThreadId from "../utils/getEmailsByThreadId";
import { showError } from "../redux/commonSliceFunctions";
import { IErrorResponse } from "../interfaces/IErrorResponse";

type EmailCardProps = {
  email: IEmailThreadResponse;
};

const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const [showEmailModal, { toggle }] = useDisclosure(false);

  const [threadEmails, setThreadEmails] = useState<IEmailResponse[] | null>(null);

  const [loading, setLoading] = useState(false);

  const handleCardClick = async () => {
    setLoading(true);

    try {
      const res = await getEmailsByThreadId(email.id);
      setThreadEmails(res.data);
    } catch (err) {
      const error = err as IErrorResponse;
      showError(error.response?.data.message);
    } finally {
      setLoading(false);
      toggle();
    }
  };

  return (
    <>
      <Card className="cursor-pointer relative" onClick={handleCardClick} withBorder shadow="sm">
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
