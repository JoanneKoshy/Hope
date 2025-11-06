import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, LogOut, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MemoryGarden } from "@/components/MemoryGarden";

interface Notebook {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: any;
}

const Dashboard = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [allMemories, setAllMemories] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/auth");
      return;
    }

    const q = query(
      collection(db, "notebooks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notebooksData: Notebook[] = [];
      snapshot.forEach((doc) => {
        notebooksData.push({ id: doc.id, ...doc.data() } as Notebook);
      });
      setNotebooks(notebooksData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));

      // Fetch all memories from all notebooks
      const allMemoriesData: any[] = [];
      for (const notebook of notebooksData) {
        const memoriesQuery = query(collection(db, "memories"), where("notebookId", "==", notebook.id));
        const memoriesSnapshot = await getDocs(memoriesQuery);
        memoriesSnapshot.forEach((doc) => {
          allMemoriesData.push({ id: doc.id, ...doc.data() });
        });
      }
      setAllMemories(allMemoriesData);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "notebooks"), {
        title,
        description,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Notebook created!" });
      setTitle("");
      setDescription("");
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

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Hope</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <MemoryGarden memories={allMemories} notebookCount={notebooks.length} />
          
          <div className="flex justify-between items-center mb-8 mt-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Your Memory Notebooks</h2>
              <p className="text-muted-foreground">Organize life stories into beautiful collections</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-soft">
                  <Plus className="w-4 h-4 mr-2" />
                  New Notebook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateNotebook}>
                  <DialogHeader>
                    <DialogTitle>Create a New Notebook</DialogTitle>
                    <DialogDescription>
                      Give your notebook a meaningful title and describe what memories you'll capture.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Notebook Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Childhood Memories"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="What stories will this notebook hold?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Notebook"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {notebooks.length === 0 ? (
            <Card className="text-center py-16 shadow-soft">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No notebooks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first notebook to start preserving precious memories
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Notebook
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notebooks.map((notebook) => (
                <Card
                  key={notebook.id}
                  className="cursor-pointer hover:shadow-medium transition-all animate-fade-in"
                  onClick={() => navigate(`/notebook/${notebook.id}`)}
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-3">
                      <BookOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{notebook.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {notebook.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
