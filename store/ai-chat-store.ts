import { ChatMessage } from "@/types/ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { idbStorage } from "./idb-storage";

interface AIChatStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  addUserMessage: (content: string) => ChatMessage;
  addAssistantMessage: (content: string, options?: { isError?: boolean }) => ChatMessage;
  clearMessages: () => void;
  resetMessagesUpToIndex: (index: number) => void;
  getWelcomeMessage: () => ChatMessage;
}

export const useAIChatStore = create<AIChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message: ChatMessage) => {
        set((state) => ({ messages: [...state.messages, message] }));
      },
      addUserMessage: (content: string) => {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content,
          createdAt: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, message] }));
        return message;
      },
      addAssistantMessage: (content: string, options) => {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
          createdAt: Date.now(),
          isError: options?.isError,
        };

        set((state) => ({ messages: [...state.messages, message] }));
        return message;
      },
      clearMessages: () => {
        set({ messages: [] });
      },
      resetMessagesUpToIndex: (index: number) => {
        set((state) => ({ messages: state.messages.slice(0, index) }));
      },
      getWelcomeMessage: () => ({
        id: "welcome-message",
        role: "assistant",
        content: "Ask me anything about your product data, billing, or AI usage.",
        createdAt: Date.now(),
      }),
    }),
    {
      name: "ai-chat-storage",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

export const getUserMessagesCount = (messages: ChatMessage[]) =>
  messages.filter((message) => message.role === "user").length;

export const getLastUserMessage = (messages: ChatMessage[]) =>
  [...messages].reverse().find((message) => message.role === "user");
