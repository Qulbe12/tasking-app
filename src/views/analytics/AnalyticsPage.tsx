import React, { useMemo, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { useAppSelector } from "../../redux/store";
import { Flex, Select } from "@mantine/core";

const AnalyticsPage = () => {
  const { data: templates } = useAppSelector((state) => state.templates);
  const { data: documents } = useAppSelector((state) => state.documents);

  const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({
    "2,name": true,
    "2,city": true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const columns = useMemo(() => {
    const foundTemplate = templates.find((t) => t.id === selectedTemplate);

    return [
      //   { name: "type", header: "Type", defaultFlex: 1 },
      { name: "title", header: "Document Title", defaultFlex: 1 },
      { name: "description", header: "Description", defaultFlex: 1 },
      { name: "status", header: "Status", defaultFlex: 1 },
      { name: "priority", header: "Priority", defaultFlex: 1 },
      {
        name: "startDate",
        header: "Start Date",
        defaultFlex: 1,
        render: ({ value }: { value: string }) => new Date(value).toDateString(),
      },
      {
        name: "dueDate",
        header: "Due Date",
        defaultFlex: 1,
        render: ({ value }: { value: string }) => new Date(value).toDateString(),
      },
    ];
  }, [selectedTemplate, documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      return d.template.id === selectedTemplate;
    });
  }, [selectedTemplate]);

  return (
    <div>
      <h1>Analytics</h1>

      <Flex my="md">
        <Select
          label="Document Type"
          value={selectedTemplate}
          onChange={(val) => setSelectedTemplate(val)}
          data={[
            ...templates.map((t) => {
              return { value: t.id, label: t.name };
            }),
          ]}
        />
      </Flex>
      <ReactDataGrid
        idProperty="id"
        cellSelection={cellSelection}
        onCellSelectionChange={(val) => {
          console.log(val);

          setCellSelection(val);
        }}
        columns={columns}
        dataSource={filteredDocuments}
        // style={gridStyle}
      />
    </div>
  );
};

export default AnalyticsPage;
