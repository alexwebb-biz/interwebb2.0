import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">;

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    viewport={{ once: true, amount: 0.2 }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
