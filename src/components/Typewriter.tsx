
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
}

const Typewriter = ({ text, className, delay = 0 }: TypewriterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      duration: 1.5,
      ease: "easeInOut",
      delay,
    });
    return controls.stop;
  }, [text.length, delay, count]);

  return (
    <motion.span className={className}>
      {displayText}
    </motion.span>
  );
};

export default Typewriter;
