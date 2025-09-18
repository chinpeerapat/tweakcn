"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGuards } from "@/hooks/use-guards";
import { SUBSCRIPTION_STATUS_QUERY_KEY, useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { ChatResponseBody } from "@/types/ai";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { Loader2, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

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
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const helperTextId = useId();
  const messageLogId = useId();
  const messageLogLabelId = useId();
  const usageBadgeId = useId();

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

        await queryClient.invalidateQueries({
          queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY],
        });
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
  const requestsUsed = subscriptionStatus?.requestsUsed;

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
            id={usageBadgeId}
            isSubscribed={isSubscribed ?? false}
            requestsRemaining={requestsRemaining}
            requestsUsed={requestsUsed}
            isSubmitting={isSubmitting || isPending}
          />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-[400px] flex-1 flex-col gap-4 overflow-hidden p-0">
        <ScrollArea className="flex-1 px-6 py-4" aria-labelledby={messageLogLabelId}>
          <p id={messageLogLabelId} className="sr-only">
            Conversation history
          </p>
          <div
            id={messageLogId}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex flex-col gap-4"
          >
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
          <Label htmlFor={inputId} className="sr-only">
            Send a message to the Insights Copilot
          </Label>
          <Textarea
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about usage trends, billing issues, or what to build next..."
            maxLength={500}
            rows={3}
            disabled={isSubmitting}
            aria-describedby={`${helperTextId} ${usageBadgeId}`}
          />
          <span id={helperTextId} className="sr-only">
            Messages are stored securely and shared with your team.
          </span>
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
  requestsUsed,
  isSubmitting,
  id,
}: {
  isSubscribed: boolean;
  requestsRemaining?: number;
  requestsUsed?: number;
  isSubmitting: boolean;
  id?: string;
}) {
  const totalResponses =
    typeof requestsRemaining === "number" && typeof requestsUsed === "number"
      ? requestsRemaining + requestsUsed
      : undefined;

  const hasUsageWindow = typeof totalResponses === "number" && totalResponses > 0;
  const usedResponses = typeof requestsUsed === "number" ? requestsUsed : 0;
  const remainingResponses =
    typeof requestsRemaining === "number" ? Math.max(requestsRemaining, 0) : undefined;
  const progressValue =
    hasUsageWindow && totalResponses !== 0
      ? Math.min(100, Math.round((usedResponses / totalResponses) * 100))
      : undefined;

  let headline = "Checking limits…";
  let detail: string | null = null;
  let badgeStyles = "bg-muted text-foreground";

  if (isSubscribed) {
    headline = "Unlimited responses";
    detail = isSubmitting
      ? "Recording usage…"
      : "Every request is included in your plan.";
    badgeStyles = "bg-primary/10 text-primary";
  } else if (!hasUsageWindow) {
    detail = isSubmitting ? "Recording usage…" : "Hang tight while we sync your latest usage.";
  } else if (remainingResponses && remainingResponses > 0) {
    const responseLabel = remainingResponses === 1 ? "response" : "responses";
    headline = `${usedResponses} of ${totalResponses} responses used`;
    detail = isSubmitting
      ? "Recording usage…"
      : `${remainingResponses} free ${responseLabel} left before you need to upgrade.`;
    badgeStyles = "bg-amber-100 text-amber-900";
  } else if (hasUsageWindow) {
    headline = `${usedResponses} of ${totalResponses} responses used`;
    detail = isSubmitting
      ? "Recording usage…"
      : "You've reached the free tier limit. Upgrade for unlimited responses.";
    badgeStyles = "bg-destructive/10 text-destructive";
  }

  return (
    <div
      id={id}
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex min-w-[220px] flex-col gap-1 rounded-lg px-3 py-2 text-xs font-medium shadow-sm",
        badgeStyles
      )}
    >
      <span className="text-sm font-semibold leading-tight">{headline}</span>
      {detail && <span className="text-[11px] leading-tight opacity-90">{detail}</span>}
      {hasUsageWindow && !isSubscribed && typeof progressValue === "number" && (
        <>
          <Progress value={progressValue} aria-hidden="true" className="h-1 w-full bg-background/40" />
          <span className="sr-only">
            You have used {usedResponses} of {totalResponses} responses.
          </span>
        </>
      )}
    </div>
  );
}
