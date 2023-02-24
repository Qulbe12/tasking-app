import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import {
  GeneralEvents,
  BoardEvents,
  NylasEvents,
  DocumentEvents,
  TemplateEvents,
  IJoinRoomPayload,
  JoinRoom,
  IBoard,
  IDocument,
  ITemplate,
} from "hexa-sdk";
import { SOCKET_URL } from "../constants/URLS";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateSocketBoard } from "../redux/slices/boardsSlice";

const useSockets = () => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);

  const socket = useMemo(() => {
    return io(SOCKET_URL, {
      auth: {
        token: user?.accessToken,
      },
    });
  }, [user]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // General Events
    socket.on(GeneralEvents.Message, (message) => {
      console.log("General Event: ", message);
    });

    // Board Events
    socket.on(BoardEvents.Created, (payload: IBoard) => {
      console.log(payload);
    });
    socket.on(BoardEvents.Updated, (payload: IBoard) => {
      dispatch(updateSocketBoard(payload));
      console.log(payload);
    });
    socket.on(BoardEvents.Deleted, (payload: IBoard) => {
      console.log(payload);
    });

    // Document Events
    socket.on(DocumentEvents.Created, (payload: IDocument) => {
      console.log(payload);
    });
    socket.on(DocumentEvents.Updated, (payload: IDocument) => {
      console.log(payload);
    });
    socket.on(DocumentEvents.Deleted, (payload: IDocument) => {
      console.log(payload);
    });

    // Template Events
    socket.on(TemplateEvents.Created, (payload: ITemplate) => {
      console.log(payload);
    });
    socket.on(TemplateEvents.Updated, (payload: ITemplate) => {
      console.log(payload);
    });
    socket.on(TemplateEvents.Deleted, (payload: ITemplate) => {
      console.log(payload);
    });

    // Nylas Events
    socket.on(NylasEvents.Connected, (payload) => {
      console.log(payload);
    });
    socket.on(NylasEvents.Failed, (payload) => {
      console.log(payload);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.off(GeneralEvents.Message);

      socket.off(BoardEvents.Created);
      socket.off(BoardEvents.Updated);
      socket.off(BoardEvents.Deleted);

      socket.off(DocumentEvents.Created);
      socket.off(DocumentEvents.Updated);
      socket.off(DocumentEvents.Deleted);

      socket.off(TemplateEvents.Created);
      socket.off(TemplateEvents.Updated);
      socket.off(TemplateEvents.Deleted);

      socket.off(NylasEvents.Connected);
      socket.off(NylasEvents.Failed);
    };
  }, []);

  useEffect(() => {
    if (!activeWorkspace?.id || !user?.id) return;
    joinWorkspace({ accessToken: user?.id, room: activeWorkspace?.id });
  }, [activeWorkspace]);

  useEffect(() => {
    if (!activeBoard?.id || !user?.id) return;
    joinBoard({ accessToken: user?.id, room: activeBoard?.id });
  }, [activeBoard]);

  const joinBoard = (payload: IJoinRoomPayload) => {
    socket.emit(JoinRoom.BoardRoom, payload);
  };

  const joinWorkspace = (payload: IJoinRoomPayload) => {
    socket.emit(JoinRoom.WorkspaceRoom, payload);
  };

  return { isConnected, joinBoard, joinWorkspace };
};

export default useSockets;
