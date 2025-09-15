"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Timeframe = "1d" | "7d" | "30d";

interface UsageSummary {
  requests: number;
  timeframe: Timeframe;
}

interface ChartDataPoint {
  daysSinceEpoch?: number;
  hoursSinceEpoch?: number;
  date: string;
  totalRequests: number;
}

interface UsageMetricsResponse {
  stats: UsageSummary;
  chartData: ChartDataPoint[];
}

const timeframeLabels = {
  "1d": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

const chartConfig = {
  totalRequests: {
    label: "Requests",
    color: "var(--primary)",
  },
};

export function UsageStats() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const [stats, setStats] = useState<UsageSummary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/usage?timeframe=${timeframe}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as UsageMetricsResponse;

        if (!isMounted) {
          return;
        }

        setStats(data.stats);
        setChartData(data.chartData);
      } catch (fetchError) {
        console.error("Error fetching usage data:", fetchError);
        if (!isMounted) {
          return;
        }
        setStats(null);
        setChartData([]);
        setError("Unable to load usage metrics. Please try again later.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const formatDate = (dateString: string, timeframe: Timeframe) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    if (timeframe === "1d") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Select value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : error ? (
            <div className="space-y-1">
              <p className="text-destructive text-sm font-medium">Unable to load usage data</p>
              <p className="text-muted-foreground text-xs">Please try again in a moment.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tight">{stats?.requests ?? 0}</div>
              <p className="text-muted-foreground text-sm">
                requests in {timeframeLabels[timeframe].toLowerCase()}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          ) : error ? (
            <div className="flex h-[200px] items-center justify-center">
              <div className="text-center text-sm text-destructive">
                <p>We couldn&apos;t load your usage metrics.</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Refresh the page or try again later.
                </p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value, timeframe)}
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => formatDate(value, timeframe)}
                />
                <Bar
                  dataKey="totalRequests"
                  fill="var(--color-totalRequests)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">No usage data available</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Make some AI requests to see your usage statistics
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
