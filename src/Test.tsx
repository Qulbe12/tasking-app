import { GeneralEvents, IJoinRoomPayload, ITemplate, JoinRoom } from "hexa-sdk/dist/app.api";
import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

import { TemplateEvents } from "hexa-sdk";

const App = () => {
  const [board, setBoard] = useState<string>();
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    const socket: Socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on(GeneralEvents.Message, (message: string) => {
      console.log(message);
    });

    socket.on(TemplateEvents.Created, (payload: ITemplate) => {
      // do more with template
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function joinBoard() {
    if (board) {
      const payload: IJoinRoomPayload = {
        accessToken: "",
        room: board,
      };
      socket.emit(JoinRoom.BoardRoom, payload);
    }
  }

  return (
    <>
      <input placeholder="board" onChange={(e) => setBoard(e.target.value)} />
      <button onClick={joinBoard}>Join Board</button>
    </>
  );
};

export default App;
