import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (!authLoading && user) {
      // Check if there's a redirect destination stored
      const redirectPath = localStorage.getItem('redirectAfterAuth');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!" });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account created successfully!" });
      }
      
      // Check if there's a redirect destination
      const redirectPath = localStorage.getItem('redirectAfterAuth');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      let errorMessage = "An error occurred during authentication";
      
      // Handle specific Firebase auth errors
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-credential" || error.message?.includes("INVALID_LOGIN_CREDENTIALS")) {
        errorMessage = isLogin 
          ? "Invalid email or password. If you don't have an account, please sign up first." 
          : "Unable to create account. Please try again.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account already exists with this email";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/Password sign-in is not enabled. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Hope</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isLogin ? "Welcome back" : "Start preserving memories"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
