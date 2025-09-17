"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useGuards } from "@/hooks/use-guards";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { ChatResponseBody } from "@/types/ai";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { Loader2, Send } from "lucide-react";

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatPanel() {
  const { toast } = useToast();
  const {
    messages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    getWelcomeMessage,
  } = useAIChatStore();
  const { checkValidSession, checkValidSubscription } = useGuards();
  const { subscriptionStatus } = useSubscription();

  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage(getWelcomeMessage());
    }
  }, [messages.length, addMessage, getWelcomeMessage]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim()) return;
    if (!checkValidSession("signup")) return;
    if (!checkValidSubscription()) return;

    const messageContent = input.trim();
    setInput("");

    addUserMessage(messageContent);
    const history = useAIChatStore
      .getState()
      .messages.map(({ role, content }) => ({ role, content }));

    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok) {
          if (response.headers.get("Content-Type")?.includes("application/json")) {
            const errorBody = await response.json();
            toast({
              title: "Unable to process request",
              description: errorBody.message ?? "Please try again in a moment.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Unable to process request",
              description: "Please try again in a moment.",
              variant: "destructive",
            });
          }
          addAssistantMessage("I couldn't process that request. Please try again.", {
            isError: true,
          });
          return;
        }

        const data = (await response.json()) as ChatResponseBody;
        addAssistantMessage(data.content);
      } catch (error) {
        console.error(error);
        toast({
          title: "Network error",
          description: "We were unable to contact the AI service.",
          variant: "destructive",
        });
        addAssistantMessage("I ran into a network issue while responding. Please try again.", {
          isError: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const requestsRemaining = subscriptionStatus?.requestsRemaining;
  const isSubscribed = subscriptionStatus?.isSubscribed;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Insights Copilot</CardTitle>
            <p className="text-muted-foreground text-sm">
              Ask product questions, craft onboarding flows, or troubleshoot billing in seconds.
            </p>
          </div>
          <UsageBadge
            isSubscribed={isSubscribed ?? false}
            requestsRemaining={requestsRemaining}
            isSubmitting={isSubmitting || isPending}
          />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-[400px] flex-1 flex-col gap-4 overflow-hidden p-0">
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1">
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm shadow-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : message.isError
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-line text-left leading-relaxed">{message.content}</p>
                </div>
                <span className="text-muted-foreground text-xs">
                  {message.role === "user" ? "You" : "Tweak AI"} • {formatTimestamp(message.createdAt)}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about usage trends, billing issues, or what to build next..."
            maxLength={500}
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs">
              We store messages securely so your team can pick up where you left off.
            </span>
            <Button type="submit" disabled={isSubmitting || !input.trim()} className="min-w-[120px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Generating
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="size-4" />
                  Ask
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}

function UsageBadge({
  isSubscribed,
  requestsRemaining,
  isSubmitting,
}: {
  isSubscribed: boolean;
  requestsRemaining?: number;
  isSubmitting: boolean;
}) {
  if (isSubscribed) {
    return (
      <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
        Unlimited responses
      </div>
    );
  }

  if (typeof requestsRemaining !== "number") {
    return (
      <div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
        Checking limits…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        requestsRemaining > 0 ? "bg-amber-100 text-amber-900" : "bg-destructive/10 text-destructive"
      )}
    >
      {isSubmitting ? "Recording usage…" : `${requestsRemaining} free responses left`}
    </div>
  );
}
