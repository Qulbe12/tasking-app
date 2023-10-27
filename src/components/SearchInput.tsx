import {
  Center,
  Flex,
  Loader,
  Modal,
  Progress,
  Select,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { forwardRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch } from "../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../hooks/useDebounedValue";
import { axiosPrivate } from "../config/axios";
import { ISearchResponse } from "../interfaces/ISearchResponse";
import { IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import useChangeBoard from "../hooks/useChangeBoard";

interface ISearchRes {
  id: string;
  value: string;
  title: string;
  label: string;
  description?: string;
  group: string;
  workspaceId?: string;
  boardId?: string;
}

const SearchInput = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleBoardChange, loadingText, loadingValue } = useChangeBoard();

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
        const { boards, documents, sheets, templates } = data;

        const newSearchRes: ISearchRes[] = [];

        boards.forEach((b) => {
          newSearchRes.push({
            id: b.id,
            value: b.id,
            title: b.title,
            label: b.title,
            description: b.description,
            group: "Boards",
            workspaceId: b.workspace?.id,
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
            boardId: d.board.id,
            workspaceId: d.board.workspace.id,
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
            boardId: sheet.board.id,
            workspaceId: sheet.board.workspace.id,
          });
        });

        templates.forEach((template) => {
          newSearchRes.push({
            id: template.id,
            value: template.id,
            title: template.title,
            label: template.title,
            description: "",
            group: "Templates",
            boardId: template.board.id,
            workspaceId: template.board.workspace.id,
          });
        });

        // workspaces.forEach((workspace) => {
        //   newSearchRes.push({
        //     id: workspace.id,
        //     value: workspace.id,
        //     title: workspace.title,
        //     label: workspace.title,
        //     description: "",
        //     group: "Workspaces",
        //   });
        // });

        setSearchRes(newSearchRes);
      } catch (err) {
        console.log(err);
      } finally {
        setGettingResults(false);
      }
    }

    SearchEntities();
  }, [searchTerm]);

  const handleItemClick = (id: string, group: string, workspaceId?: string, boardId?: string) => {
    console.log(group);

    switch (group) {
      case "Boards":
        handleBoardChange(id, workspaceId, true);
        return;

      case "Sheets":
        navigate(`/board/sheets/${id}`);
        return;
      case "Documents":
        if (boardId) {
          handleBoardChange(boardId, workspaceId, true).then(() => {
            navigate("/board", { state: { documentId: id } });
          });
        }
        return;
      case "Templates":
        console.log("Board Clicked");
        return;
      case "Workspaces":
        console.log("Board Clicked");
        return;

      default:
        break;
    }
  };

  const SelectItem = forwardRef<HTMLDivElement, ISearchRes>(
    ({ label, description, id, group, boardId, workspaceId }: ISearchRes, ref) => (
      <div
        ref={ref}
        className="m-2 cursor-pointer"
        onClick={() => {
          handleItemClick(id, group, workspaceId, boardId);
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
    <>
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
      <Modal
        opacity={0.9}
        opened={!!loadingText}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"90vh"} mx="auto">
          <div className="w-full">
            <Progress value={loadingValue} animate />
            {loadingText || "Loading..."}
          </div>
        </Center>
      </Modal>
    </>
  );
};

export default SearchInput;
