
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between gap-6 px-6 py-3 bg-card/90 backdrop-blur-md rounded-full shadow-soft border border-primary/20 animate-scale-in">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <Heart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Hope
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="hover:text-primary transition-colors"
          >
            Login
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="shadow-soft hover:shadow-medium transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingNav;
