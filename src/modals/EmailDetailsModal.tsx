import { createStyles, TypographyStylesProvider, Paper, Modal, Flex, Text } from "@mantine/core";
import { IEmailResponse } from "../interfaces/IEmailResponse";
import CommonModalProps from "./CommonModalProps";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface EmailDetailsModalProps {
  emails: IEmailResponse[] | null;
}

function EmailDetailsModal({
  emails,
  onClose,
  opened,
  title,
}: EmailDetailsModalProps & CommonModalProps) {
  const { classes } = useStyles();

  return (
    <Modal padding="md" size="90%" title={title} opened={opened} onClose={onClose}>
      <Flex align={"start"} direction="column" mb="md">
        {emails && (
          <Text size={"lg"}>{`${emails[0].from[0].name} <${emails[0].from[0].email}>`}</Text>
        )}
        {emails && (
          <Text fw={200}>{emails[0]?.date && new Date(emails[0].date * 1000).toDateString()}</Text>
        )}
      </Flex>
      <Paper withBorder radius="md" className={classes.comment} bg="white" p="md">
        <TypographyStylesProvider className={classes.body}>
          {emails && (
            <div
              style={{
                all: "unset",
              }}
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: emails[0].body }}
            />
          )}
        </TypographyStylesProvider>
      </Paper>
    </Modal>
  );
}

export default EmailDetailsModal;
