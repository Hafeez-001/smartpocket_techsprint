
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export async function sendChatMessage(
//   message: string,
//   Context?: any
// ) {
//   const res = await axios.post(`${API_URL}/api/chat`, {
//     message,
//     Context
//   });

//   return res.data.reply;
// }

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type ChatResponse = {
  reply: string;
};

export async function sendChatMessage(
  message: string,
  context?: any
): Promise<string> {
  const res = await axios.post<ChatResponse>(`${API_URL}/api/chat`, {
    message,
    context
  });

  return res.data.reply;
}
