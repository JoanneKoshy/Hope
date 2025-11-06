import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { Smile, Frown, Meh } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  sentiment?: "happy" | "sad" | "neutral";
  createdAt: any;
}

interface SentimentTimelineProps {
  memories: Memory[];
}

export const SentimentTimeline = ({ memories }: SentimentTimelineProps) => {
  const timelineData = useMemo(() => {
    if (memories.length === 0) return [];

    // Get the date range
    const now = new Date();
    const sortedMemories = [...memories].sort((a, b) => 
      a.createdAt?.seconds - b.createdAt?.seconds
    );
    
    const firstMemoryDate = sortedMemories[0]?.createdAt?.toDate() || now;
    const oldestDate = firstMemoryDate < subMonths(now, 11) ? firstMemoryDate : subMonths(now, 11);
    
    // Generate months
    const months = eachMonthOfInterval({
      start: startOfMonth(oldestDate),
      end: startOfMonth(now)
    });

    // Count sentiments per month
    const dataByMonth = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59);
      
      const memoriesInMonth = memories.filter(memory => {
        if (!memory.createdAt) return false;
        const memoryDate = memory.createdAt.toDate();
        return memoryDate >= monthStart && memoryDate <= monthEnd;
      });

      const happy = memoriesInMonth.filter(m => m.sentiment === "happy").length;
      const sad = memoriesInMonth.filter(m => m.sentiment === "sad").length;
      const neutral = memoriesInMonth.filter(m => m.sentiment === "neutral").length;
      const total = memoriesInMonth.length;

      return {
        month: format(month, "MMM yy"),
        happy,
        sad,
        neutral,
        total
      };
    });

    return dataByMonth;
  }, [memories]);

  const totalStats = useMemo(() => {
    const happy = memories.filter(m => m.sentiment === "happy").length;
    const sad = memories.filter(m => m.sentiment === "sad").length;
    const neutral = memories.filter(m => m.sentiment === "neutral").length;
    
    return { happy, sad, neutral, total: memories.length };
  }, [memories]);

  if (memories.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Add memories to see your emotional journey</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Memories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Happy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalStats.happy}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStats.total > 0 ? Math.round((totalStats.happy / totalStats.total) * 100) : 0}% of memories
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <Frown className="w-4 h-4" />
              Sad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{totalStats.sad}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStats.total > 0 ? Math.round((totalStats.sad / totalStats.total) * 100) : 0}% of memories
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Meh className="w-4 h-4" />
              Neutral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">{totalStats.neutral}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStats.total > 0 ? Math.round((totalStats.neutral / totalStats.total) * 100) : 0}% of memories
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Emotional Journey Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="happy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Happy"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="sad" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Sad"
                dot={{ fill: "hsl(var(--destructive))" }}
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                name="Neutral"
                dot={{ fill: "hsl(var(--muted-foreground))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
