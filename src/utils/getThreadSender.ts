import { IThreadExpandedResponse } from "../interfaces/nylas/IThreadResponse";

export function getThreadSender(threadObject: IThreadExpandedResponse, userEmail: string) {
  if (threadObject.messages && threadObject.messages.length > 0) {
    const firstMessage = threadObject.messages[0];
    if (firstMessage.from && firstMessage.from.length > 0) {
      return {
        email: firstMessage.from[0].email,
        name: firstMessage.from[0].name || "",
      };
    }
  } else {
    for (const participant of threadObject.participants) {
      if (participant.email === userEmail) {
        return {
          email: participant.email,
          name: participant.name || "",
        };
      }
    }
  }
  return {
    email: null,
    name: null,
  };
}
