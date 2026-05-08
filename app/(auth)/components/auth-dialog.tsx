"use client";

import Github from "@/assets/github.svg";
import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { PostLoginActionType } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  trigger?: React.ReactNode; // Optional trigger element
  postLoginActionType?: PostLoginActionType | null;
}

// Get contextual copy based on the post-login action
function getContextualCopy(actionType?: PostLoginActionType | null) {
  switch (actionType) {
    case "SAVE_THEME":
      return {
        title: "Sign in to Save",
        description: "Sign in to save your theme and access it from anywhere",
      };
    case "SAVE_THEME_FOR_SHARE":
      return {
        title: "Sign in to Share",
        description: "Sign in to save and share your theme with others",
      };
    case "SAVE_THEME_FOR_V0":
      return {
        title: "Sign in to open in v0",
        description: "Sign in to save your theme and open it in v0",
      };
    case "AI_GENERATE_FROM_PAGE":
    case "AI_GENERATE_FROM_CHAT":
    case "AI_GENERATE_FROM_CHAT_SUGGESTION":
    case "AI_GENERATE_EDIT":
    case "AI_GENERATE_RETRY":
      return {
        title: "Sign in for AI",
        description: "Sign in to use AI-powered theme generation",
      };
    case "CHECKOUT":
      return {
        title: "Sign in to continue",
        description: "Sign in to complete your purchase",
      };
    default:
      return null;
  }
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  trigger,
  postLoginActionType,
}: AuthDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const contextualCopy = getContextualCopy(postLoginActionType);

  const getCallbackUrl = () => {
    const baseUrl = pathname || "/editor/theme";
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  useEffect(() => {
    if (open) {
      setIsSignIn(initialMode === "signin");
    }
  }, [open, initialMode]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      // Handle error appropriately (e.g., show a toast notification)
    }
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password || (!isSignIn && !trimmedName)) {
      toast({
        title: "Missing details",
        description: "Enter your email, password, and name when creating an account.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailLoading(true);

    try {
      const result = isSignIn
        ? await authClient.signIn.email({
            email: trimmedEmail,
            password,
            callbackURL: getCallbackUrl(),
          })
        : await authClient.signUp.email({
            name: trimmedName,
            email: trimmedEmail,
            password,
            callbackURL: getCallbackUrl(),
          });

      if (result.error) {
        toast({
          title: isSignIn ? "Sign in failed" : "Sign up failed",
          description: result.error.message || "Please check your details and try again.",
          variant: "destructive",
        });
        return;
      }

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Email auth error:", error);
      toast({
        title: isSignIn ? "Sign in failed" : "Sign up failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      // Handle error appropriately
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>}
      <ResponsiveDialogContent className="overflow-hidden sm:max-w-100">
        <div className="space-y-4">
          <ResponsiveDialogHeader className="sm:pt-8">
            <ResponsiveDialogTitle className="text-center text-2xl font-bold">
              {contextualCopy?.title ?? (isSignIn ? "Welcome back" : "Create account")}
            </ResponsiveDialogTitle>
            <p className="text-muted-foreground text-center">
              {contextualCopy?.description ??
                (isSignIn
                  ? "Sign in to your account to continue"
                  : "Sign up to get started with tweakcn")}
            </p>
          </ResponsiveDialogHeader>

          <div className="space-y-6 p-6 pt-2">
            <form className="space-y-3" onSubmit={handleEmailAuth}>
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="auth-name">Name</Label>
                  <Input
                    id="auth-name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isEmailLoading || isGoogleLoading || isGithubLoading}
              >
                {isEmailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSignIn ? "Sign in with Email" : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
                disabled={isGoogleLoading || isGithubLoading}
              >
                <Google className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
                {isGoogleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>

              <Button
                variant="outline"
                onClick={handleGithubSignIn}
                size="lg"
                className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
                disabled={isGoogleLoading || isGithubLoading}
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">Continue with GitHub</span>
                {isGithubLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>
            </div>

            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    {isSignIn ? "New to tweakcn?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={toggleMode}
                  className="text-primary focus:ring-primary text-sm font-medium hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {isSignIn ? "Create an account" : "Sign in to your account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
