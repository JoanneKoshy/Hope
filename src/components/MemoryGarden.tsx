import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemoryGardenProps {
  memories: any[];
  notebookCount: number;
}

export const MemoryGarden = ({ memories, notebookCount }: MemoryGardenProps) => {
  const [reflection, setReflection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateReflection = async () => {
    if (memories.length === 0) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-memory-reflection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ memories, notebookCount }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate reflection");
      }

      const data = await response.json();
      setReflection(data.reflection);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate reflection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memories.length > 0 && !reflection) {
      generateReflection();
    }
  }, [memories.length]);

  if (memories.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-soft border-primary/20 bg-gradient-subtle">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          Your Memory Garden
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Growing your memory garden...</span>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-destructive text-sm">{error}</p>
            <Button onClick={generateReflection} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : reflection ? (
          <div className="space-y-4">
            <p className="text-lg leading-relaxed italic">{reflection}</p>
            <Button 
              onClick={generateReflection} 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Reflection
            </Button>
          </div>
        ) : (
          <Button onClick={generateReflection} variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Reflection
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
