"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  style?: React.CSSProperties;
}

export function AnimatedCounter({ value, style }: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20, mass: 0.5 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [rendered, setRendered] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      setRendered(String(v));
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {rendered}
    </motion.span>
  );
}
