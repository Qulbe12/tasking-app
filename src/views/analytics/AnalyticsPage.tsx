/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useMemo, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import { useAppSelector } from "../../redux/store";
import { Flex, Select } from "@mantine/core";
import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-dark.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import _ from "lodash";

const AnalyticsPage = () => {
  const { data: templates } = useAppSelector((state) => state.templates);
  const { data: documents } = useAppSelector((state) => state.documents);
  const { mode } = useAppSelector((state) => state.theme);

  const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({
    "2,name": true,
    "2,city": true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(templates[0].id || null);
  const columns = useMemo(() => {
    const baseCols = [
      //   { name: "type", header: "Type", defaultFlex: 1 },
      { name: "title", header: "Document Title", defaultFlex: 1 },
      { name: "description", header: "Description", defaultFlex: 1 },
      { name: "status", header: "Status", defaultFlex: 1 },
      { name: "priority", header: "Priority", defaultFlex: 1 },
      {
        name: "startDate",
        header: "Start Date",
        defaultFlex: 1,
        groupBy: false,
        render: ({ value }: { value: string }) => new Date(value).toDateString(),
      },
      {
        name: "dueDate",
        header: "Due Date",
        defaultFlex: 1,
        groupBy: false,
        render: ({ value }: { value: string }) => new Date(value).toDateString(),
      },
    ];

    const foundTemplate = templates.find((t) => t.id === selectedTemplate);

    foundTemplate?.fields.forEach((f) => {
      baseCols.push({ name: f.key, header: f.label, defaultFlex: 1 });
    });

    return baseCols;
  }, [selectedTemplate]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      return d.template.id === selectedTemplate;
    });
  }, [selectedTemplate]);

  const total = useMemo(() => {
    let newTotal = 0;

    // const documentIds = Object.keys(cellSelection)[0].split(",")[0];
    const documentIds = Object.keys(cellSelection).map((k) => {
      return k.split(",")[0];
    });

    const foundDocuments = documents.filter((d) => documentIds.includes(d.id));
    const key = Object.keys(cellSelection)[0].split(",")[1];

    foundDocuments.map((d) => {
      if (!key) return 0;
      // @ts-ignore
      newTotal += +d[key];
    });

    // console.log(id, key);

    return {
      cell: key,
      total: newTotal,
    };
  }, [cellSelection]);

  return (
    <div>
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
        theme={mode === "dark" ? "default-dark" : "default-light"}
        idProperty="id"
        cellSelection={cellSelection}
        onCellSelectionChange={(val) => {
          setCellSelection(val);
        }}
        columns={columns}
        defaultGroupBy={[]}
        dataSource={filteredDocuments}
        className="h-screen"
      />
      <h2>
        {_.startCase(total.cell)}:{" "}
        {!isNaN(total.total) ? total.total : "Please select valid numbers"}
      </h2>
    </div>
  );
};

export default AnalyticsPage;
