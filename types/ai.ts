export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  isError?: boolean;
}

export interface CreateMessageInput {
  content: string;
}

export interface ChatRequestBody {
  messages: Array<Pick<ChatMessage, "role" | "content">>;
}

export interface ChatResponseBody {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}
