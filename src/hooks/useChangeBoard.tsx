import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { IBoard } from "hexa-sdk";
import { IEntityBoard } from "../interfaces/IEntityBoard";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";
import { axiosPrivate } from "../config/axios";
import IBoardResourceResponse from "../interfaces/resources/IBoardResourceResponse";
import { setActiveBoard } from "../redux/slices/boardsSlice";
import { setTemplates } from "../redux/slices/templateSlice";
import { setGroups } from "../redux/slices/groupsSlice";
import { setDocuments } from "../redux/slices/documentSlice";
import { setSheets } from "../redux/slices/sheetSlice";
import { showError } from "../redux/commonSliceFunctions";
import { IErrorResponse } from "../interfaces/IErrorResponse";

const useChangeBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { activeWorkspace, data: workspaces } = useAppSelector((state) => state.workspaces);

  const [loadingText, setLoadingText] = useState<string | null>(null);
  const loadingValue = 100;

  const handleBoardChange = async (board: IEntityBoard | IBoard, workspaceId?: string) => {
    if (!activeWorkspace) {
      const foundWorkspace = workspaces.find((ws) => ws.id === workspaceId);
      if (!foundWorkspace) return;
      dispatch(setActiveWorkspace(foundWorkspace));
    }

    setLoadingText("Gathering Resources...");
    try {
      const res = await axiosPrivate.get<IBoardResourceResponse>(`/resources/boards/${board.id}`);

      const { data } = res;
      const { documents, templates, groups, sheets } = data;

      dispatch(setActiveBoard(data.board));
      dispatch(setTemplates(templates));
      dispatch(setGroups(groups));
      dispatch(setDocuments(documents));
      dispatch(setSheets(sheets));

      setLoadingText(null);

      navigate("/board");
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      showError(error.response?.data.message);
    }
  };

  return { loadingText, loadingValue, handleBoardChange };
};

export default useChangeBoard;
