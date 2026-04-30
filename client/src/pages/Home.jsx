import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { carApi } from "../api/endpoints";
import AnimatedCounter from "../components/AnimatedCounter";
import MagneticButton from "../components/MagneticButton";
import ParticleCanvas from "../components/ParticleCanvas";
import Skeleton from "../components/Skeleton";
import ThreeCar from "../components/ThreeCar";

const words = ["ENGINEERED", "FOR", "THE", "UNTAMED", "ELITE"];

export default function Home() {
  const headlineRef = useRef(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chars = headlineRef.current?.querySelectorAll(".char");
    if (chars?.length) {
      gsap.fromTo(chars, { y: 115, opacity: 0, rotateX: -80 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.018, ease: "power4.out", delay: 0.2 });
    }
  }, []);

  useEffect(() => {
    carApi
      .all()
      .then(({ data }) => setCars(data.slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="overflow-hidden bg-obsidian text-platinum">
      <section className="relative min-h-screen overflow-hidden px-6 pt-32 md:px-10">
        <ParticleCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(214,63,49,.18),transparent_28%),linear-gradient(180deg,rgba(0,0,0,.2),#050505)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="mb-5 max-w-[21rem] text-[11px] uppercase tracking-[0.32em] text-gold sm:max-w-none sm:text-sm sm:tracking-[0.5em]">Private manufacture since 1984</p>
            <h1 ref={headlineRef} className="max-w-5xl overflow-hidden font-display text-[18vw] leading-[0.78] tracking-normal text-platinum md:text-[10rem] lg:text-[9.8rem]">
              {words.map((word) => (
                <span key={word} className="mr-5 inline-block overflow-hidden">
                  {word.split("").map((char, index) => (
                    <span key={`${word}-${index}`} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-xl text-xl text-platinum/68">
              VELOCE MOTORS crafts limited-production performance vehicles where carbon architecture, obsessive cabin detail, and electric-red theatre collide.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <MagneticButton as={Link} to="/build" className="w-full justify-center sm:w-auto">
                Build Your Car
              </MagneticButton>
              <Link to="/models" className="inline-flex w-full items-center justify-center gap-3 border border-white/15 px-5 py-3 font-display text-xl tracking-[0.08em] text-platinum hover:border-ember hover:text-ember sm:w-auto sm:px-6">
                Explore Models <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <motion.div className="relative" initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}>
            <div className="absolute inset-x-16 bottom-10 h-20 bg-ember/30 blur-3xl" />
            <ThreeCar accent="#d63f31" />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3 md:px-10">
        <AnimatedCounter value="500" suffix="+ HP" label="Available Power" />
        <AnimatedCounter value="3" suffix=".2s" label="0-100 KM/H" />
        <AnimatedCounter value="42" label="Years of Excellence" />
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <p className="text-sm uppercase tracking-[0.5em] text-ember">Featured fleet</p>
            <h2 className="mt-3 font-display text-7xl text-platinum md:text-9xl">THE GARAGE</h2>
          </motion.div>
          <div className="scrollbar-hide mt-10 flex snap-x gap-6 overflow-x-auto pb-8">
            {loading &&
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[430px] min-w-[320px]" />)}
            {cars.map((car) => (
              <motion.article key={car.id} className="relative min-w-[330px] snap-center overflow-hidden border border-white/10 bg-gunmetal md:min-w-[460px]" whileHover={{ scale: 0.985 }} transition={{ ease: "easeOut" }}>
                <img src={car.image} alt={car.name} className="h-[430px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-gold">{car.category}</p>
                  <h3 className="font-display text-5xl text-platinum">{car.name}</h3>
                  <Link to={`/models/${car.id}`} className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-ember">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
