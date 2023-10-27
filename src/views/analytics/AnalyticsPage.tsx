/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import { useAppSelector } from "../../redux/store";
import _ from "lodash";
import Filter from "../../components/Filter";
import { CSVLink } from "react-csv";
import { Button, Flex, Menu } from "@mantine/core";
import { IconFileSpreadsheet, IconPackgeExport } from "@tabler/icons";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import JSZip from "jszip";
import fileSaver from "file-saver";
import { useTranslation } from "react-i18next";
import { TypeColumns } from "@inovua/reactdatagrid-community/types/TypeColumn";
import { TypeFilterValue } from "@inovua/reactdatagrid-community/types";

import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-dark.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import "./AnalyticsPage.scss";
import { IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";
import { isValidDate } from "../../utils/isValidDate";

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const { data: templates } = useAppSelector((state) => state.templates);
  const { data: documents } = useAppSelector((state) => state.documents);
  const { mode } = useAppSelector((state) => state.theme);

  const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({
    "2,name": true,
    "2,city": true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates]);

  const columns: TypeColumns = useMemo(() => {
    let baseCols: TypeColumns = [];

    if (!selectedTemplate) {
      baseCols = [
        { name: "title", header: t("title"), defaultFlex: 1 },
        { name: "description", header: t("description"), defaultFlex: 1 },
        { name: "type", header: t("type"), defaultFlex: 1 },
        {
          name: "status",
          header: t("status"),
          defaultFlex: 1,
        },
        { name: "priority", header: t("priority"), defaultFlex: 1 },
        {
          name: "startDate",
          header: t("startDate"),
          defaultFlex: 1,
          groupBy: false,
          render: ({ value }: { value: string }) => new Date(value).toDateString(),
        },
        {
          name: "dueDate",
          header: t("dueDate"),
          defaultFlex: 1,
          groupBy: false,
          render: ({ value }: { value: string }) => new Date(value).toDateString(),
        },
      ];
    }

    const foundTemplate = templates.find((t) => t.id === selectedTemplate);

    foundTemplate?.fields.forEach((f) => {
      baseCols.push({
        name: f.key,
        header: f.label,
        defaultFlex: 1,
        render: ({ value }: { value: string }) =>
          isValidDate(value) ? new Date(value).toDateString() : value,
      });
    });

    return baseCols;
  }, [selectedTemplate]);

  const filterValue: TypeFilterValue = useMemo(() => {
    const baseFilters: TypeFilterValue = [
      { name: "title", operator: "contains", type: "string", value: "" },
      { name: "description", operator: "contains", type: "string", value: "" },
      { name: "status", operator: "contains", type: "string", value: "" },
      { name: "priority", operator: "contains", type: "string", value: "" },
      { name: "startDate", operator: "contains", type: "string", value: "" },
      { name: "dueDate", operator: "contains", type: "string", value: "" },
    ];

    if (!selectedTemplate) {
      baseFilters.splice(3, 0, { name: "type", operator: "contains", type: "string", value: "" });
    }

    const uniqueKeyValues = new Set();

    templates.forEach((template) => {
      template.fields.forEach((field) => {
        uniqueKeyValues.add(field.key);
      });
    });

    const uniqueKeysArray: string[] = Array.from(uniqueKeyValues) as string[];

    uniqueKeysArray.forEach((key) => {
      baseFilters.push({ name: key, operator: "contains", type: "string", value: "" });
    });

    return baseFilters;
  }, [columns, selectedTemplate]);

  const total = useMemo(() => {
    let newTotal = 0;
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

    return {
      cell: key,
      total: newTotal,
    };
  }, [cellSelection]);

  const [filter, setFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    const foundTemplate = templates.find((t) => t.name === filter[0])?.id;

    setSelectedTemplate(foundTemplate || null);
  }, [filter]);

  const { search } = useAppSelector((state) => state.filters);

  const filteredData: IDocumentResponse[] = useMemo<IDocumentResponse[]>(() => {
    if (search && filter.length) {
      return documents.filter((d) => {
        return (
          JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase()) &&
          filter.includes(d.template.name)
        );
      });
    }
    if (search) {
      return documents.filter((d) => {
        return JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase());
      });
    }
    if (filter.length || statusFilter.length) {
      return documents.filter((d) => {
        return filter.includes(d.template.name) || statusFilter.includes(d.status);
      });
    }

    return documents;
  }, [filter, documents, search, statusFilter]);

  const dataToExport = useMemo(() => {
    const data: string[][] = [[]];

    columns.forEach((c) => {
      data[0].push(c.header);
    });

    filteredData.forEach((d: IDocumentResponse) => {
      const tempVals: string[] = [];

      tempVals.push(d["title"]);
      tempVals.push(d["description"]);
      tempVals.push(d["status"]);
      tempVals.push(d["priority"]);
      tempVals.push(dayjs(d["startDate"]).format("MM/DD/YYYY"));
      tempVals.push(dayjs(d["dueDate"]).format("MM/DD/YYYY"));

      d.template.fields.forEach((f) => {
        if (
          f.key === "title" ||
          f.key === "description" ||
          f.key === "status" ||
          f.key === "priority" ||
          f.key === "startDate" ||
          f.key === "dueDate"
        )
          return;

        // @ts-ignore
        tempVals.push(d[f.key]);
      });

      data.push(tempVals);
    });

    return data;
  }, [columns, filteredData]);

  const reportTemplateRef = useRef<any>(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      orientation: "l",
      format: "a2",
      unit: "px",
    });

    // Adding the fonts.
    doc.setFont("Inter-Regular", "normal");

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("document");
      },
    });
  };

  const handleExportAllDocuments = async () => {
    const folderName = `files ${dayjs(new Date()).format("DD-MM-YYYY HHmm")}`;

    const zip = new JSZip();
    const folder = zip.folder(folderName);

    if (!folder) return;

    filteredData.forEach((document) => {
      document.attachments.forEach((attachment) => {
        const blobPromise = fetch(attachment.url).then((r) => {
          return r.blob();
        });

        folder.file(attachment.name, blobPromise);
      });
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      fileSaver(content, folderName);
    });
  };

  return (
    <div>
      <div className="mb-2">
        <Filter singleSelection options={templates.map((t) => t.name)} onChange={setFilter} />
        <Filter options={["Complete", "In Progress", "Todo"]} onChange={setStatusFilter} />
      </div>

      <Flex justify="flex-end">
        <Menu shadow="md" width={300}>
          <Menu.Target>
            <Button leftIcon={<IconPackgeExport size={14} />}>{t("export")}</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconFileSpreadsheet size={14} />}>
              <CSVLink
                data={dataToExport}
                filename={"Documents: " + new Date().toDateString()}
                target="_blank"
              >
                CSV
              </CSVLink>
            </Menu.Item>
            <Menu.Item onClick={handleGeneratePdf}>PDF</Menu.Item>
            <Menu.Item onClick={handleExportAllDocuments}>
              All {filter ? filter + " Attachments" : "Attachments"}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <div className="mt-4">
        <ReactDataGrid
          defaultFilterValue={filterValue}
          theme={mode === "dark" ? "default-dark" : "default-light"}
          idProperty="id"
          cellSelection={cellSelection}
          onCellSelectionChange={(val) => {
            setCellSelection(val);
          }}
          columns={columns}
          defaultGroupBy={[]}
          dataSource={filteredData}
          className="data-grid"
        />
      </div>
      <h2>
        {_.startCase(total.cell)}:{" "}
        {!isNaN(total.total) ? total.total : "Please select valid numbers"}
      </h2>

      <div className="hidden">
        <table className="border border-black p-2" ref={reportTemplateRef}>
          <thead>
            <tr className="border border-black p-2">
              {dataToExport[0].map((d, i) => {
                return (
                  <td
                    style={{
                      color: "black",
                    }}
                    className="border border-black p-2"
                    key={i + "titleRowDateToExport"}
                  >
                    {d}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataToExport.map((d, i) => {
              return (
                <tr className="border border-black p-2" key={i + "bodyRowDataToExport"}>
                  {d.map((v, valIndex) => {
                    if (i === 0) return;
                    return (
                      <td
                        className="border border-black p-2"
                        style={{
                          color: "black",
                        }}
                        key={valIndex + "rowData"}
                      >
                        {`${v || ""}`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
