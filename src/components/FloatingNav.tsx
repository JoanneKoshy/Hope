
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
        "fixed w-[40%] top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full shadow-medium border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Heart className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
            Hope
          </span>
        </div>
        <div className="h-6 w-px bg-border" />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            
          </Button>
        </nav>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/auth")}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingNav;
