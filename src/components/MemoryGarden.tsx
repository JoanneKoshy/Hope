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
    if (memories.length === 0) {
      console.log("MemoryGarden: No memories to generate reflection from");
      return;
    }
    
    console.log("MemoryGarden: Starting reflection generation...");
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
        console.error("MemoryGarden: Error response:", errorData);
        throw new Error(errorData.error || "Failed to generate reflection");
      }

      const data = await response.json();
      console.log("MemoryGarden: Reflection generated:", data.reflection);
      setReflection(data.reflection);
    } catch (err) {
      console.error("MemoryGarden: Error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate reflection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("MemoryGarden: memories.length =", memories.length, "notebookCount =", notebookCount);
    // Only auto-generate if we have memories and haven't generated yet
    if (memories.length > 0 && !reflection && !loading) {
      console.log("MemoryGarden: Auto-generating reflection...");
      generateReflection();
    }
  }, [memories.length]);

  if (memories.length === 0) {
    return (
      <Card className="shadow-soft border-primary/20 bg-gradient-subtle animate-fade-in mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            Your Memory Garden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-center">
            <blockquote className="text-lg leading-relaxed font-cormorant italic py-6 px-6 text-foreground/80">
              "Every journey begins with a single step. Start capturing your precious moments today."
            </blockquote>
            <p className="text-sm text-muted-foreground">
              Add memories to your notebook and watch beautiful reflections bloom in your garden 🌱
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-primary/20 bg-gradient-subtle animate-fade-in mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          Your Memory Garden
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="space-y-4">
            <p className="text-destructive text-sm">{error}</p>
            <Button onClick={generateReflection} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : reflection ? (
          <div className="space-y-6 animate-fade-in">
            <blockquote className="text-lg leading-relaxed font-cormorant italic text-center py-6 px-6 text-foreground/80">
              "{reflection}"
            </blockquote>
            <div className="flex justify-center">
              <Button 
                onClick={generateReflection} 
                variant="outline" 
                size="lg"
                className="text-primary hover:text-primary shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating your reflection...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Self Reflection
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground text-lg">Creating your reflection...</span>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <p className="text-lg leading-relaxed font-cormorant italic text-muted-foreground py-4">
                  Your memories are waiting to bloom into a beautiful reflection...
                </p>
                <Button onClick={generateReflection} variant="default" size="lg" className="shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Self Reflection
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
