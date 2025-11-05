import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Smile, Frown, Meh } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Memory {
  id: string;
  content: string;
  sentiment?: "happy" | "sad" | "neutral";
  createdAt: any;
}

interface NotebookData {
  title: string;
  description: string;
}

const SharedNotebook = () => {
  const { id } = useParams();
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch notebook
      const notebookDoc = await getDoc(doc(db, "notebooks", id!));
      if (notebookDoc.exists()) {
        setNotebook(notebookDoc.data() as NotebookData);
      }

      // Fetch memories
      const q = query(collection(db, "memories"), where("notebookId", "==", id));
      const snapshot = await getDocs(q);
      const memoriesData: Memory[] = [];
      snapshot.forEach((doc) => {
        memoriesData.push({ id: doc.id, ...doc.data() } as Memory);
      });
      setMemories(memoriesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    };

    fetchData();
  }, [id]);

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

  if (!notebook) return null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Hope</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-3 font-serif">{notebook.title}</h1>
            <p className="text-lg text-muted-foreground">{notebook.description}</p>
            <p className="text-sm text-muted-foreground mt-4">
              This notebook has been shared with you
            </p>
          </div>

          {memories.length === 0 ? (
            <Card className="text-center py-16 shadow-soft">
              <CardContent>
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No memories yet</h3>
                <p className="text-muted-foreground">
                  This notebook is waiting for its first memory
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {memories.map((memory) => (
                <Card key={memory.id} className="shadow-soft hover:shadow-medium transition-all animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
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
                    <p className="text-lg leading-relaxed font-serif whitespace-pre-wrap">
                      {memory.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SharedNotebook;
