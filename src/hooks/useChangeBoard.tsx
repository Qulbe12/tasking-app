import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getBoardById } from "../redux/api/boardsApi";
import { getAllGroups } from "../redux/api/groupsApi";
import { getDocuments } from "../redux/api/documentApi";
import { useNavigate } from "react-router-dom";
import { IBoard } from "hexa-sdk";
import { IEntityBoard } from "../interfaces/IEntityBoard";
import { getAllTemplates } from "../redux/api/templateApi";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";

const useChangeBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { activeWorkspace, data: workspaces } = useAppSelector((state) => state.workspaces);

  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [loadingValue, setLoadingValue] = useState(0);

  const handleBoardChange = async (board: IEntityBoard | IBoard, workspaceId?: string) => {
    if (!activeWorkspace) {
      const foundWorkspace = workspaces.find((ws) => ws.id === workspaceId);
      if (!foundWorkspace) return;
      dispatch(setActiveWorkspace(foundWorkspace));
    }

    setLoadingValue(0);

    setLoadingText("Getting Board Details...");
    setLoadingValue((v) => (v += 25));
    await dispatch(getBoardById(board.id));

    if (workspaceId) {
      setLoadingText("Getting Templates...");
      setLoadingValue((v) => (v += 25));
      await dispatch(getAllTemplates(workspaceId));
    }

    setLoadingText("Getting Groups...");
    setLoadingValue((v) => (v += 25));
    await dispatch(getAllGroups(board.id));

    setLoadingText("Getting Documents...");
    setLoadingValue((v) => (v += 25));
    await dispatch(getDocuments({ boardId: board.id, query: {} }));

    setLoadingText(null);
    setLoadingValue(0);

    navigate("/board");
  };

  return { loadingText, loadingValue, handleBoardChange };
};

export default useChangeBoard;
