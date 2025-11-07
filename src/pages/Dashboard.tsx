import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, LogOut, Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MemoryGarden } from "@/components/MemoryGarden";
import { useAuth } from "@/contexts/AuthContext";

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
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;
    
    // Redirect if not authenticated
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
      
      // Set loading to false only after everything is loaded
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, user, authLoading]);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

  const handleDeleteNotebook = async (notebookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteDoc(doc(db, "notebooks", notebookId));
      toast({ title: "Notebook deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Loading your memories...
          </h2>
          <p className="text-muted-foreground">Preparing your memory garden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm animate-fade-in">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Hope</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-slide-up">
            <MemoryGarden memories={allMemories} notebookCount={notebooks.length} />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 mt-6 sm:mt-8 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Your Memory Notebooks</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Organize life stories into beautiful collections</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-soft w-full sm:w-auto">
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
            <Card className="text-center py-12 sm:py-16 shadow-soft">
              <CardContent>
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No notebooks yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 px-4">
                  Create your first notebook to start preserving precious memories
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Notebook
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notebooks.map((notebook) => (
                <Card
                  key={notebook.id}
                  className="cursor-pointer hover:shadow-medium transition-all animate-fade-in relative"
                  onClick={() => navigate(`/notebook/${notebook.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-3">
                        <BookOpen className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notebook?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{notebook.title}" and all its memories. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => handleDeleteNotebook(notebook.id, e)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
