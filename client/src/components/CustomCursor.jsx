import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 700, damping: 40 });
  const dotY = useSpring(y, { stiffness: 700, damping: 40 });
  const ringX = useSpring(x, { stiffness: 160, damping: 20 });
  const ringY = useSpring(y, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event) => setActive(Boolean(event.target.closest("a,button,input,textarea,select")));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <motion.div
        className="absolute h-3 w-3 rounded-full bg-gold"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute h-10 w-10 rounded-full border border-ember"
        animate={{ scale: active ? 1.65 : 1, opacity: active ? 0.55 : 1 }}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
}
