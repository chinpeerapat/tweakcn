"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StarterChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat({
    api: "/api/ai/chat?stream=1",
  });

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-md border p-3">
        <div className="max-h-[360px] overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <div className="font-medium text-muted-foreground">{m.role === "user" ? "You" : "AI"}</div>
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-muted-foreground">Thinking…</div>}
          {error && <div className="text-xs text-destructive">{String(error.message || "Error")}</div>}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything…"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setInput("")}
          disabled={isLoading}
        >
          Clear
        </Button>
      </form>
    </div>
  );
}

