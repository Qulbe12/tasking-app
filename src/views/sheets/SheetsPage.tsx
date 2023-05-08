import React from "react";
import { useAppSelector } from "../../redux/store";
import { SimpleGrid } from "@mantine/core";
import DocumentCard from "../../components/DocumentCard";

const SheetsPage = () => {
  const { data } = useAppSelector((state) => state.documents);
  return (
    <div>
      SheetsPage (Sheets module wip)
      <SimpleGrid cols={4}>
        {data.map((d) => {
          if (d.template.name === "Sheets") return <DocumentCard key={d.id} document={d} />;
        })}
      </SimpleGrid>
    </div>
  );
};

export default SheetsPage;
