import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { carApi } from "../api/endpoints";
import CarCard from "../components/CarCard";
import Skeleton from "../components/Skeleton";

const categories = ["All", "SUV", "Sedan", "Sports", "Electric"];

export default function Models() {
  const [cars, setCars] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    carApi
      .all(category)
      .then(({ data }) => setCars(data))
      .finally(() => setLoading(false));
  }, [category]);

  const title = useMemo(() => (category === "All" ? "FULL MODEL RANGE" : `${category.toUpperCase()} RANGE`), [category]);

  return (
    <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 text-platinum md:px-10">
      <section className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <p className="text-sm uppercase tracking-[0.5em] text-gold">Machines for every kind of velocity</p>
          <h1 className="mt-3 font-display text-7xl md:text-9xl">{title}</h1>
        </motion.div>
        <div className="mt-9 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`border px-5 py-2 text-sm uppercase tracking-[0.25em] transition ${category === item ? "border-ember bg-ember text-white shadow-glow" : "border-white/15 text-platinum/65 hover:border-gold hover:text-gold"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-[420px]" />)
            : cars.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      </section>
    </main>
  );
}
