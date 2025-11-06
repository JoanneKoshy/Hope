import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Share2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingNav from "@/components/FloatingNav";
import AnimateOnScroll from "@/components/AnimateOnScroll";

import Typewriter from "@/components/Typewriter";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm">
      <FloatingNav />
      {/* Hero Section */}
      <div className="container min-h-screen flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 sm:px-5 py-2 bg-card/80 backdrop-blur-sm rounded-full shadow-soft border border-primary/10 animate-slide-up">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-float" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Preserve memories forever</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent leading-none tracking-tighter animate-scale-in" style={{ 
            backgroundSize: '200% auto',
            animation: 'scale-in 0.6s ease-out, shimmer 3s linear infinite'
          }}>
            Hope
          </h1>
          
          <Typewriter 
            text="Where life stories live forever" 
            className="text-xl sm:text-2xl md:text-3xl text-foreground/80 mb-8 sm:mb-10 font-serif italic animate-fade-in px-4" 
          />
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-slide-up px-4">
            A memory keeper that beautifully captures your stories and turns life's moments into timeless digital notebooks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in px-4">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-medium hover:shadow-soft hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              onClick={() => navigate("/auth")}
            >
              Start Preserving Memories
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              onClick={() => navigate("/auth")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all h-full">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Beautiful Notebooks</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize memories into themed notebooks. Each story is beautifully formatted with AI-enhanced writing.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all h-full">
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Recording</h3>
              <p className="text-muted-foreground leading-relaxed">
                Speak naturally or type freely. Our AI transcribes, structures, and beautifies every precious memory.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all h-full">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Share & Preserve</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share notebooks with family through secure links. Keep memories private or let loved ones read them anytime.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">Key Features</h2>
            <p className="text-base sm:text-lg text-muted-foreground text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
              Everything you need to preserve and share precious memories
            </p>
          </AnimateOnScroll>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <AnimateOnScroll>
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all border border-primary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Organized Notebooks</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Create themed notebooks for different life chapters. Keep memories organized and easy to find.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all border border-primary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Voice Recording & AI Transcription</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Record memories by speaking naturally. Our AI transcribes and formats your stories beautifully.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.15}>
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all border border-primary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Sentiment Timeline</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Visualize emotional journeys with automatic sentiment detection and beautiful timeline views.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all border border-primary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Secure Sharing</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Share entire notebooks or individual memories with family through secure, private links.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <AnimateOnScroll>
          <div className="max-w-2xl mx-auto text-center bg-card p-8 sm:p-12 rounded-3xl shadow-medium">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 sm:mb-6 animate-float" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">
              Don't let precious stories fade away
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
              Start preserving the memories that matter most. Your loved ones will thank you.
            </p>
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
              onClick={() => navigate("/auth")}
            >
              Begin Your Journey
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default Landing;
