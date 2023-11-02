import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import {
  BoardEvents,
  DocumentEvents,
  GeneralEvents,
  IJoinRoomPayload,
  JoinRoom,
  NylasConnectedPayload,
  NylasEvents,
  TemplateEvents,
} from "hexa-sdk/dist/app.api";
import { SOCKET_URL } from "../constants/URLS";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateSocketBoard } from "../redux/slices/boardsSlice";
import { setNylasToken } from "../redux/slices/nylasSlice";
import IBoardResponse from "../interfaces/boards/IBoardResponse";

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
    socket.on(GeneralEvents.Message, () => {
      //
    });

    // Board Events
    socket.on(BoardEvents.Created, (payload) => {
      console.log("board", payload);
      //
    });
    socket.on(BoardEvents.Updated, (payload: IBoardResponse) => {
      dispatch(updateSocketBoard(payload));
      //
    });
    socket.on(BoardEvents.Deleted, () => {
      //
    });

    // Document Events
    socket.on(DocumentEvents.Created, (payload: any) => {
      console.log(payload);
      //
    });
    socket.on(DocumentEvents.Updated, () => {
      //
    });
    socket.on(DocumentEvents.Deleted, () => {
      //
    });

    // Template Events
    socket.on(TemplateEvents.Created, () => {
      //
    });
    socket.on(TemplateEvents.Updated, () => {
      //
    });
    socket.on(TemplateEvents.Deleted, () => {
      //
    });

    // Nylas Events
    socket.on(NylasEvents.Connected, async (payload: NylasConnectedPayload) => {
      await dispatch(setNylasToken(payload));
    });
    socket.on(NylasEvents.Failed, () => {
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
