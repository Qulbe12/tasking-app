import { nylasAxios } from "../config/nylasAxios";
import { IEmailResponse } from "../interfaces/IEmailResponse";

async function getEmailsByThreadId(threadId: string) {
  return await nylasAxios.get<IEmailResponse[]>(`/messages?thread_id=${threadId}`);
}

export default getEmailsByThreadId;
