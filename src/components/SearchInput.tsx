import { Flex, Loader, Select, Text, useMantineTheme } from "@mantine/core";
import React, { forwardRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch } from "../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../hooks/useDebounedValue";
import { axiosPrivate } from "../config/axios";
import { ISearchResponse } from "../interfaces/ISearchResponse";
import { IconSearch } from "@tabler/icons";

interface ISearchRes {
  id: string;
  value: string;
  title: string;
  label: string;
  description?: string;
  group: string;
}

const SearchInput = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();

  const { search } = useAppSelector((state) => state.filters);

  const searchTerm = useDebouncedValue(search, 300);

  const [gettingResults, setGettingResults] = useState(false);
  const [searchRes, setSearchRes] = useState<ISearchRes[]>([]);

  useEffect(() => {
    if (!searchTerm) return;

    async function SearchEntities() {
      setGettingResults(true);
      try {
        const res = await axiosPrivate.get<ISearchResponse>(`/search?searchTerm=${searchTerm}`);

        console.log(res.data);

        const { data } = res;
        const { boards, documents, sheets, templates, workspaces } = data;

        const newSearchRes: ISearchRes[] = [];

        boards.forEach((b) => {
          newSearchRes.push({
            id: b.id,
            value: b.id,
            title: b.title,
            label: b.title,
            description: b.description,
            group: "Boards",
          });
        });

        documents.forEach((d) => {
          newSearchRes.push({
            id: d.id,
            value: d.id,
            title: d.title,
            label: d.title,
            description: d.description,
            group: "Documents",
          });
        });

        sheets.forEach((sheet) => {
          newSearchRes.push({
            id: sheet.id,
            value: sheet.id,
            title: sheet.title,
            label: sheet.title,
            description: sheet.description,
            group: "Sheets",
          });
        });

        templates.forEach((template) => {
          newSearchRes.push({
            id: template.id,
            value: template.id,
            title: template.name,
            label: template.name,
            description: "",
            group: "Templates",
          });
        });

        workspaces.forEach((workspace) => {
          newSearchRes.push({
            id: workspace.id,
            value: workspace.id,
            title: workspace.name,
            label: workspace.name,
            description: "",
            group: "Workspaces",
          });
        });

        setSearchRes(newSearchRes);
      } catch (err) {
        console.log(err);
      } finally {
        setGettingResults(false);
      }
    }

    SearchEntities();
  }, [searchTerm]);

  const handleItemClick = (id: string, group: string) => {
    switch (group) {
      case "Boards":
        console.log("Board Clicked");
        return;

      case "Sheets":
        console.log("Board Clicked");
        return;

      default:
        break;
    }
  };

  const SelectItem = forwardRef<HTMLDivElement, ISearchRes>(
    ({ label, description, id, group }: ISearchRes, ref) => (
      <div
        ref={ref}
        className="m-2 cursor-pointer"
        onClick={() => {
          handleItemClick(id, group);
        }}
      >
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
      </div>
    ),
  );

  SelectItem.displayName = "SearchInput";
  return (
    <Flex>
      <Select
        icon={gettingResults ? <Loader size="xs" /> : <IconSearch size="1em" />}
        data={searchRes}
        sx={{
          [theme.fn.smallerThan("md")]: {
            width: "300px",
          },
          [theme.fn.smallerThan("sm")]: {
            width: "150px",
          },
        }}
        w="400px"
        itemComponent={SelectItem}
        placeholder={`${t("search")}`}
        variant="filled"
        searchable
        searchValue={search}
        onSearchChange={(e) => {
          dispatch(setSearch(e));
        }}
      />
    </Flex>
  );
};

export default SearchInput;
