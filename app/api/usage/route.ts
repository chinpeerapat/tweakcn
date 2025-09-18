import { getMyUsageChartData, getMyUsageStats } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { NextRequest, NextResponse } from "next/server";

type Timeframe = "1d" | "7d" | "30d";

const DEFAULT_TIMEFRAME: Timeframe = "7d";

function parseTimeframe(value: string | null): Timeframe {
  if (value === "1d" || value === "7d" || value === "30d") {
    return value;
  }
  return DEFAULT_TIMEFRAME;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = parseTimeframe(searchParams.get("timeframe"));

    const [stats, chartData] = await Promise.all([
      getMyUsageStats(timeframe),
      getMyUsageChartData(timeframe),
    ]);

    return NextResponse.json({ stats, chartData });
  } catch (error) {
    return handleError(error, { route: "/api/usage" });
  }
}
