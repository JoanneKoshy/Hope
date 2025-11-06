import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Heart, Smile, Frown, Meh, Share2, Trash2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PhotoUpload } from "@/components/PhotoUpload";
import { SentimentTimeline } from "@/components/SentimentTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Memory {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  userId: string;
  sentiment?: "happy" | "sad" | "neutral";
  photoUrl?: string;
  createdAt: any;
}

interface NotebookData {
  title: string;
  description: string;
}

const Notebook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [deleteMemoryId, setDeleteMemoryId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/auth");
      return;
    }

    // Fetch notebook details
    const fetchNotebook = async () => {
      const notebookDoc = await getDoc(doc(db, "notebooks", id!));
      if (notebookDoc.exists()) {
        setNotebook(notebookDoc.data() as NotebookData);
      }
    };
    fetchNotebook();

    // Listen to memories
    const q = query(
      collection(db, "memories"),
      where("notebookId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memoriesData: Memory[] = [];
      snapshot.forEach((doc) => {
        memoriesData.push({ id: doc.id, ...doc.data() } as Memory);
      });
      setMemories(memoriesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const detectSentiment = (text: string): "happy" | "sad" | "neutral" => {
    const happyWords = ["happy", "joy", "love", "wonderful", "amazing", "great", "beautiful", "laugh"];
    const sadWords = ["sad", "miss", "lost", "difficult", "hard", "pain", "cry", "alone"];
    
    const lowerText = text.toLowerCase();
    const happyCount = happyWords.filter(word => lowerText.includes(word)).length;
    const sadCount = sadWords.filter(word => lowerText.includes(word)).length;
    
    if (happyCount > sadCount) return "happy";
    if (sadCount > happyCount) return "sad";
    return "neutral";
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Beautify content using Groq API
      const { data: beautifyData, error: beautifyError } = await supabase.functions.invoke('beautify-memory', {
        body: { content }
      });

      if (beautifyError) {
        console.error("Error beautifying memory:", beautifyError);
        toast({
          title: "Note",
          description: "Using original text",
        });
      }

      const beautifiedContent = beautifyData?.beautifiedContent || content;
      const sentiment = detectSentiment(beautifiedContent);

      await addDoc(collection(db, "memories"), {
        title,
        content: beautifiedContent,
        notebookId: id,
        userId: user.uid,
        sentiment,
        photoUrl: photoUrl || null,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Memory saved!" });
      setTitle("");
      setContent("");
      setPhotoUrl("");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", description: "Share this link with family and friends" });
  };

  const handleDeleteMemory = async () => {
    if (!deleteMemoryId) return;

    try {
      await deleteDoc(doc(db, "memories", deleteMemoryId));
      toast({ title: "Memory deleted" });
      setDeleteMemoryId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!notebook) return null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2 font-serif">{notebook.title}</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">{notebook.description}</p>
          </div>

          <div className="flex justify-center mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-soft">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateMemory}>
                  <DialogHeader>
                    <DialogTitle>Capture a Memory</DialogTitle>
                    <DialogDescription>
                      Write or speak about a precious moment. Be as detailed as you'd like.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <input
                        type="text"
                        placeholder="Give your memory a title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Memory</label>
                      <Textarea
                        placeholder="Tell your story... What happened? Who was there? How did it make you feel?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="resize-none"
                        required
                      />
                    </div>
                    <PhotoUpload
                      photoUrl={photoUrl}
                      onPhotoUploaded={setPhotoUrl}
                      onPhotoRemoved={() => setPhotoUrl("")}
                    />
                    <VoiceRecorder 
                      onTranscription={(text) => setContent((prev) => prev + (prev ? " " : "") + text)}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Memory"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="memories" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
              <TabsTrigger value="memories">
                <Heart className="w-4 h-4 mr-2" />
                Memories
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memories">
              {memories.length === 0 ? (
            <Card className="text-center py-16 shadow-soft">
              <CardContent>
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No memories yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start capturing precious moments in this notebook
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Memory
                </Button>
              </CardContent>
              </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map((memory) => (
                <Card 
                  key={memory.id} 
                  className="shadow-soft hover:shadow-medium transition-all animate-fade-in cursor-pointer"
                  onClick={() => setSelectedMemory(memory)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-serif mb-2">{memory.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {memory.createdAt?.toDate().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant="secondary" className={getSentimentColor(memory.sentiment)}>
                        {getSentimentIcon(memory.sentiment)}
                      </Badge>
                    </div>
                  </CardHeader>
                  </Card>
                ))}
              </div>
              )}
            </TabsContent>

            <TabsContent value="timeline">
              <SentimentTimeline memories={memories} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlertDialog open={!!deleteMemoryId} onOpenChange={(open) => !open && setDeleteMemoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memory?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This memory and its photo will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMemory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedMemory && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-serif mb-2">{selectedMemory.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedMemory.createdAt?.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={getSentimentColor(selectedMemory.sentiment)}>
                      {getSentimentIcon(selectedMemory.sentiment)}
                      <span className="ml-1 capitalize">{selectedMemory.sentiment || "neutral"}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const user = auth.currentUser;
                          if (!user) return;

                          const { data, error } = await supabase
                            .from('shared_memories')
                            .insert({
                              memory_id: selectedMemory.id,
                              shared_by_user_id: user.uid
                            })
                            .select()
                            .single();

                          if (error) throw error;

                          const shareUrl = `${window.location.origin}/shared-memory/${data.id}`;
                          navigator.clipboard.writeText(shareUrl);
                          toast({ title: "Memory link copied!", description: "Share this specific memory" });
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteMemoryId(selectedMemory.id);
                        setSelectedMemory(null);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMemory.photoUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedMemory.photoUrl} 
                      alt="Memory" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                <p className="text-lg leading-relaxed font-serif whitespace-pre-wrap">
                  {selectedMemory.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notebook;
