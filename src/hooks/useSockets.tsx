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
  NylasConnectedPayload,
} from "hexa-sdk/dist/app.api";
import { SOCKET_URL } from "../constants/URLS";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateSocketBoard } from "../redux/slices/boardsSlice";
import { setNylasToken } from "../redux/slices/nylasSlice";
import { fetchEmails } from "../redux/api/nylasApi";

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
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // General Events
    socket.on(GeneralEvents.Message, (message) => {
      //
    });

    // Board Events
    socket.on(BoardEvents.Created, (payload: IBoard) => {
      //
    });
    socket.on(BoardEvents.Updated, (payload: IBoard) => {
      dispatch(updateSocketBoard(payload));
      //
    });
    socket.on(BoardEvents.Deleted, (payload: IBoard) => {
      //
    });

    // Document Events
    socket.on(DocumentEvents.Created, (payload: IDocument) => {
      //
    });
    socket.on(DocumentEvents.Updated, (payload: IDocument) => {
      //
    });
    socket.on(DocumentEvents.Deleted, (payload: IDocument) => {
      //
    });

    // Template Events
    socket.on(TemplateEvents.Created, (payload: ITemplate) => {
      //
    });
    socket.on(TemplateEvents.Updated, (payload: ITemplate) => {
      //
    });
    socket.on(TemplateEvents.Deleted, (payload: ITemplate) => {
      //
    });

    // Nylas Events
    socket.on(NylasEvents.Connected, async (payload: NylasConnectedPayload) => {
      await dispatch(setNylasToken(payload));
      dispatch(fetchEmails({ offset: 0 }));
    });
    socket.on(NylasEvents.Failed, (payload) => {
      //
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
  }, [user?.user]);

  useEffect(() => {
    if (!activeWorkspace?.id || !user?.user.id) return;
    joinWorkspace({ accessToken: user?.user.id, room: activeWorkspace?.id });
  }, [activeWorkspace]);

  useEffect(() => {
    if (!activeBoard?.id || !user?.user.id) return;
    joinBoard({ accessToken: user?.user.id, room: activeBoard?.id });
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
