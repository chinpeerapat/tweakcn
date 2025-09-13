"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_STATUS_QUERY_KEY } from "@/hooks/use-subscription";

export function SubscriptionRefresher() {
  const qc = useQueryClient();
  useEffect(() => {
    qc.invalidateQueries({ queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY] });
  }, [qc]);
  return null;
}

