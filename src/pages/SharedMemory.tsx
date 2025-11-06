import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Smile, Frown, Meh } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  notebookId: string;
  userId: string;
  sentiment?: "happy" | "sad" | "neutral";
  photoUrl?: string;
  createdAt: any;
}

const SharedMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchMemory = async () => {
      try {
        // First, get the shared memory entry to find the actual memory ID
        const { data: sharedMemoryData, error: sharedError } = await supabase
          .from('shared_memories')
          .select('memory_id')
          .eq('id', id!)
          .maybeSingle();

        if (sharedError) throw sharedError;
        if (!sharedMemoryData) {
          setLoading(false);
          return;
        }

        // Then fetch the actual memory from Firebase
        const memoryDoc = await getDoc(doc(db, "memories", sharedMemoryData.memory_id));
        if (memoryDoc.exists()) {
          setMemory({ id: memoryDoc.id, ...memoryDoc.data() } as Memory);
        }
      } catch (error) {
        console.error("Error fetching memory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id, navigate]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "happy":
        return <Smile className="w-4 h-4 text-primary" />;
      case "sad":
        return <Frown className="w-4 h-4 text-destructive" />;
      default:
        return <Meh className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "happy":
        return "bg-primary/10 text-primary";
      case "sad":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Card className="max-w-md text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Memory not found</h3>
            <p className="text-muted-foreground">
              This memory may have been deleted or made private
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-2">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-serif">Hope</h1>
          <p className="text-sm text-muted-foreground mt-1">A shared memory</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-sm text-muted-foreground font-normal">
                  {memory.createdAt?.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <Badge variant="secondary" className={getSentimentColor(memory.sentiment)}>
                  {getSentimentIcon(memory.sentiment)}
                  <span className="ml-1 capitalize">{memory.sentiment || "neutral"}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {memory.photoUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={memory.photoUrl} 
                    alt="Memory" 
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}
              <p className="text-lg leading-relaxed font-serif whitespace-pre-wrap">
                {memory.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SharedMemory;
