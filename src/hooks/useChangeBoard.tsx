import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../config/axios";
import { useTranslation } from "react-i18next";
import IBoardResourceResponse from "../interfaces/resources/IBoardResourceResponse";
import { IEntityBoard } from "../interfaces/IEntityBoard";
import { IBoard } from "hexa-sdk";
import { IErrorResponse } from "../interfaces/IErrorResponse";
import { AxiosError } from "axios";
import { showError } from "../redux/commonSliceFunctions";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";
import { setSheets } from "../redux/slices/sheetSlice";
import { setActiveBoard } from "../redux/slices/boardsSlice";
import { setDocuments } from "../redux/slices/documentSlice";
import { setGroups } from "../redux/slices/groupsSlice";
import { setTemplates } from "../redux/slices/templateSlice";

const useChangeBoard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { activeWorkspace, data: workspaces } = useAppSelector((state) => state.workspaces);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const loadingValue = 100;

  const handleBoardChange = async (board: IEntityBoard | IBoard, workspaceId?: string) => {
    setIsLoading(true);
    setLoadingText(t("gatheringResources"));

    try {
      const res = await axiosPrivate.get<IBoardResourceResponse>(`/boards/${board.id}/resources`);
      const { data } = res;
      const { documents, templates, groups, sheets } = data;

      dispatch(setActiveBoard(data.board));
      dispatch(setTemplates(templates));
      dispatch(setGroups(groups));
      dispatch(setDocuments(documents));
      dispatch(setSheets(sheets));

      if (!activeWorkspace) {
        const foundWorkspace = workspaces.find((ws) => ws.id === workspaceId);
        if (foundWorkspace) dispatch(setActiveWorkspace(foundWorkspace));
      }

      navigate("/board");
    } catch (err) {
      const error = err as AxiosError<IErrorResponse>;
      showError(
        error?.response?.data?.message ||
          t("errorMessageDefault") ||
          "Error while gathering resources",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingText(null);
    }
  };

  return { isLoading, loadingText, loadingValue, handleBoardChange };
};

export default useChangeBoard;
