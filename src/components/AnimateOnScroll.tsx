
import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimateOnScroll = ({ children, className, delay = 0 }: AnimateOnScrollProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
