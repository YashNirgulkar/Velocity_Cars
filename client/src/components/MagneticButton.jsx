import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, className = "", as: Component = "button", ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      {...props}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex overflow-hidden border border-gold/60 bg-gold px-6 py-3 font-display text-xl tracking-[0.08em] text-black shadow-gold transition hover:border-ember hover:bg-ember hover:text-white ${className}`}
    >
      <motion.span
        className="absolute inset-0 bg-white/30"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1.8, opacity: [0, 0.35, 0] }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </MotionComponent>
  );
}
