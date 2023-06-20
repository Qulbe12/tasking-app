import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getBoardById } from "../redux/api/boardsApi";
import { getAllGroups } from "../redux/api/groupsApi";
import { getDocuments } from "../redux/api/documentApi";
import { useNavigate } from "react-router-dom";
import { IBoard } from "hexa-sdk";

const useChangeBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [loadingValue, setLoadingValue] = useState(0);

  const handleBoardChange = async (board: IBoard) => {
    if (!activeWorkspace) return;

    setLoadingValue(0);

    setLoadingText("Getting Board Details...");
    setLoadingValue((v) => (v += 50));
    await dispatch(getBoardById(board.id));

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
