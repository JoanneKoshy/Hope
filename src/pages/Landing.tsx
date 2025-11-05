import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Share2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-card rounded-full shadow-soft">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Preserve memories forever</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Hope
          </h1>
          
          <p className="text-2xl md:text-3xl text-foreground/80 mb-8 font-serif italic">
            Where life stories live forever
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            An AI-powered memory keeper that gently captures the precious stories of your loved ones. 
            Record, transcribe, and transform life experiences into beautiful digital notebooks that can be treasured for generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 shadow-medium hover:shadow-soft transition-all"
              onClick={() => navigate("/auth")}
            >
              Start Preserving Memories
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Beautiful Notebooks</h3>
            <p className="text-muted-foreground leading-relaxed">
              Organize memories into themed notebooks. Each story is beautifully formatted with AI-enhanced writing.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Recording</h3>
            <p className="text-muted-foreground leading-relaxed">
              Speak naturally or type freely. Our AI transcribes, structures, and beautifies every precious memory.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Share & Preserve</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share notebooks with family through secure links. Keep memories private or let loved ones read them anytime.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How Hope Works</h2>
          
          <div className="space-y-8 text-left">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create a Notebook</h3>
                <p className="text-muted-foreground">Start with a theme like "Childhood Memories" or "Working Years"</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Record Stories</h3>
                <p className="text-muted-foreground">Type or speak memories naturally. AI handles the rest</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Treasure Forever</h3>
                <p className="text-muted-foreground">Share with family, revisit memories, and keep stories alive for generations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center bg-card p-12 rounded-3xl shadow-medium">
          <Heart className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
          <h2 className="text-3xl font-bold mb-4">
            Don't let precious stories fade away
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start preserving the memories that matter most. Your loved ones will thank you.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Begin Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
