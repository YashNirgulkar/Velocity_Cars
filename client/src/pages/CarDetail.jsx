import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { carApi } from "../api/endpoints";
import MagneticButton from "../components/MagneticButton";
import Skeleton from "../components/Skeleton";

const colors = ["#d63f31", "#d6a64f", "#f5f0e8", "#2a2d34", "#111111"];

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const dragRef = useRef({ start: 0, rotation: 0, active: false });
  const [car, setCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accent, setAccent] = useState("#d63f31");
  const [rotation, setRotation] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);

  useEffect(() => {
    setLoading(true);
    Promise.all([carApi.one(id), carApi.all()])
      .then(([one, all]) => {
        setCar(one.data);
        setAccent(one.data.accent || "#d63f31");
        setCars(all.data.filter((item) => item.id !== id).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const specs = useMemo(() => {
    if (!car) return [];
    return [
      ["Power", `${car.hp} HP`],
      ["Top Speed", `${car.topSpeed} KM/H`],
      ["0-100", car.zeroToHundred],
      ["Drivetrain", car.specs?.drivetrain],
      ["Torque", car.specs?.torque],
      ["Range", car.specs?.range],
      ["Transmission", car.specs?.transmission]
    ];
  }, [car]);

  if (loading) return <main className="min-h-screen bg-obsidian px-6 pt-36"><Skeleton className="h-[70vh]" /></main>;
  if (!car) return <main className="grid min-h-screen place-items-center bg-obsidian text-platinum">Model not found.</main>;

  const onPointerDown = (event) => {
    dragRef.current = { start: event.clientX, rotation, active: true };
  };
  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    setRotation(dragRef.current.rotation + (event.clientX - dragRef.current.start) * 0.38);
  };
  const stopDrag = () => {
    dragRef.current.active = false;
  };

  return (
    <main className="bg-obsidian pb-24 text-platinum">
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.img src={car.image} alt={car.name} className="absolute inset-0 h-full w-full object-cover" style={{ y }} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-black/55 to-black/20" />
        <div className="relative z-10 flex min-h-screen items-end px-6 pb-20 md:px-10">
          <div className="max-w-6xl">
            <p className="text-sm uppercase tracking-[0.5em]" style={{ color: accent }}>{car.category}</p>
            <h1 className="mt-4 font-display text-[18vw] leading-[0.78] md:text-[12rem]">{car.name}</h1>
            <p className="mt-6 max-w-2xl text-xl text-platinum/75">{car.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-gold">Drag the silhouette</p>
          <div
            className="mt-6 grid aspect-[16/9] cursor-grab place-items-center overflow-hidden border border-white/10 bg-noise"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
          >
            <motion.div className="relative h-36 w-[70%]" animate={{ rotateY: rotation }} transition={{ type: "spring", stiffness: 110, damping: 18 }} style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-x-0 bottom-5 h-16 rounded-full blur-3xl" style={{ backgroundColor: accent }} />
              <div className="absolute left-[8%] top-10 h-20 w-[82%] rounded-[60%_60%_30%_30%] border border-white/25 bg-black shadow-2xl" />
              <div className="absolute left-[28%] top-0 h-24 w-[36%] skew-x-[-18deg] border border-white/20 bg-black/80" />
              <div className="absolute bottom-0 left-[12%] h-20 w-20 rounded-full border-[12px] border-black bg-gold" />
              <div className="absolute bottom-0 right-[12%] h-20 w-20 rounded-full border-[12px] border-black bg-gold" />
            </motion.div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center border border-white/15" onClick={() => setRotation(rotation - 35)}><ChevronLeft /></button>
            <button className="grid h-11 w-11 place-items-center border border-white/15" onClick={() => setRotation(rotation + 35)}><ChevronRight /></button>
            <span className="text-sm uppercase tracking-[0.28em] text-platinum/50">360 viewer</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, x: 70 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border border-white/10 bg-carbon/70 p-6">
          <h2 className="font-display text-6xl">SPECIFICATIONS</h2>
          <div className="mt-6 divide-y divide-white/10">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-5 py-4 text-lg">
                <span className="text-platinum/55">{label}</span>
                <span className="text-right text-platinum">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-platinum/55">Accent color</p>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button key={color} onClick={() => setAccent(color)} className="h-10 w-10 border border-white/20" style={{ backgroundColor: color, boxShadow: accent === color ? `0 0 0 3px ${color}66` : "none" }} />
              ))}
            </div>
          </div>
          <MagneticButton className="mt-8" onClick={() => navigate(`/build?model=${car.id}`)}>
            Configure & Order
          </MagneticButton>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="font-display text-6xl">RELATED CARS</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {cars.map((item) => (
            <Link key={item.id} to={`/models/${item.id}`} className="group overflow-hidden border border-white/10 bg-carbon">
              <img src={item.image} alt={item.name} className="h-64 w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-gold">{item.category}</p>
                <h3 className="font-display text-4xl">{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
