import { useCounter } from "../hooks/useCounter";

export default function AnimatedCounter({ value, suffix = "", label }) {
  const numeric = Number.parseInt(String(value).replace(/\D/g, ""), 10) || 0;
  const { ref, value: count } = useCounter(numeric);

  return (
    <div ref={ref} className="border-l border-gold/50 pl-5">
      <p className="font-display text-5xl text-platinum md:text-6xl">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm uppercase tracking-[0.28em] text-platinum/55">{label}</p>
    </div>
  );
}
