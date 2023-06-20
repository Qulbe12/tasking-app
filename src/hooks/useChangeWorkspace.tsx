import { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { IWorkspace } from "hexa-sdk";
import { setActiveBoard } from "../redux/slices/boardsSlice";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";
import { getAllTemplates } from "../redux/api/templateApi";
import { getBoards } from "../redux/api/boardsApi";

const useChangeWorkspace = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [loadingValue, setLoadingValue] = useState(0);

  const handleWorkspaceChange = async (workspace: IWorkspace) => {
    setLoadingValue(0);

    setLoadingText("Getting Workspace Details...");
    setLoadingValue((v) => (v += 25));
    dispatch(setActiveBoard(null));
    dispatch(setActiveWorkspace(workspace));

    setLoadingText("Getting Boards...");
    setLoadingValue((v) => (v += 25));
    await dispatch(getBoards(workspace.id));

    setLoadingText("Getting Templates...");
    setLoadingValue((v) => (v += 50));
    await dispatch(getAllTemplates(workspace.id));

    setLoadingText(null);
    setLoadingValue(0);

    navigate("/workspaces/boards");
  };

  return { loadingText, loadingValue, handleWorkspaceChange };
};

export default useChangeWorkspace;
