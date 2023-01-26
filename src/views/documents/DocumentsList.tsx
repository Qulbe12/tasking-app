import { Button, Flex, Grid, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import DocumentCard from "../../components/DocumentCard";
import DocumentModal from "../../modals/DocumentModal";
import { getDocuments } from "../../redux/api/documentApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const DocumentsList = () => {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((o) => !o);
  }

  const dispatch = useAppDispatch();
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { data } = useAppSelector((state) => state.documents);

  useEffect(() => {
    if (!activeBoard?.id) return;
    dispatch(getDocuments({ boardId: activeBoard?.id, query: {} }));
  }, []);

  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Documents</Title>
        <Button onClick={toggleOpen}>Add Document</Button>
      </Flex>

      <Grid>
        {data.map((d) => {
          return (
            <Grid.Col key={d.id} span="content">
              <DocumentCard document={d} />
            </Grid.Col>
          );
        })}
        {/* <Grid.Col span="content">
          <DocumentCard addCard />
        </Grid.Col> */}
      </Grid>

      <DocumentModal onClose={toggleOpen} opened={open} title="Create Document" />
    </div>
  );
};

export default DocumentsList;
