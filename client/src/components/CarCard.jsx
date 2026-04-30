import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <motion.article
      className="group relative overflow-hidden border border-white/10 bg-carbon/85 p-4 shadow-2xl"
      whileHover={{ y: -10, rotateX: 4, rotateY: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${car.accent || "#d63f31"}33, transparent 55%)` }} />
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img src={car.image} alt={car.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <span className="absolute left-4 top-4 border border-white/20 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-gold backdrop-blur">
          {car.category}
        </span>
      </div>
      <div className="relative pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-4xl text-platinum">{car.name}</h3>
            <p className="text-lg text-gold">${Number(car.price).toLocaleString()}</p>
          </div>
          <Link to={`/models/${car.id}`} className="grid h-11 w-11 place-items-center border border-gold/50 text-gold transition group-hover:bg-gold group-hover:text-black">
            <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm uppercase tracking-[0.18em] text-platinum/60">
          <span>{car.hp} HP</span>
          <span>{car.topSpeed} KM/H</span>
        </div>
      </div>
    </motion.article>
  );
}
