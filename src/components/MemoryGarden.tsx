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
    // Only auto-generate if we have memories and haven't generated yet
    // But skip the loading state by generating silently in the background
    if (memories.length > 0 && !reflection && !loading) {
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
          <p className="text-lg leading-relaxed">
            Start capturing your precious moments, and watch your memory garden grow with beautiful reflections! 🌱
          </p>
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
            <blockquote className="text-2xl leading-relaxed italic font-serif text-center py-6 px-4 border-l-4 border-primary/50">
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
                <p className="text-xl leading-relaxed italic font-serif text-muted-foreground py-4">
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
