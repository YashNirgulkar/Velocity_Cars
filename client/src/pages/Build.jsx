import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { carApi, orderApi } from "../api/endpoints";
import MagneticButton from "../components/MagneticButton";
import Skeleton from "../components/Skeleton";

const colors = [
  { name: "Rosso Corsa", value: "#d63f31", price: 0 },
  { name: "Aurum Gold", value: "#d6a64f", price: 8500 },
  { name: "Obsidian", value: "#050505", price: 6000 },
  { name: "Liquid Silver", value: "#cfd4d6", price: 7000 }
];
const wheels = [
  { name: "Forged Nero 21", price: 0 },
  { name: "Aero Carbon 22", price: 12000 },
  { name: "Monoblock Gold 23", price: 18500 }
];
const interiors = [
  { name: "Onyx Alcantara", price: 0 },
  { name: "Saddle Nappa", price: 9500 },
  { name: "Ivory Atelier", price: 14000 }
];
const packages = [
  { name: "Carbon Track Pack", price: 26000 },
  { name: "Executive Rear Lounge", price: 18000 },
  { name: "Bespoke Audio Vault", price: 14500 },
  { name: "Night Vision Touring", price: 9000 }
];

export default function Build() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    modelId: "",
    color: colors[0],
    wheels: wheels[0],
    interior: interiors[0],
    packages: [],
    customer: { name: "", email: "", phone: "" }
  });

  useEffect(() => {
    carApi
      .all()
      .then(({ data }) => {
        setCars(data);
        const selected = searchParams.get("model") || data[0]?.id || "";
        setForm((current) => ({ ...current, modelId: selected }));
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const selectedCar = cars.find((car) => car.id === form.modelId) || cars[0];
  const total = useMemo(() => {
    const packageTotal = form.packages.reduce((sum, item) => sum + item.price, 0);
    return (selectedCar?.price || 0) + form.color.price + form.wheels.price + form.interior.price + packageTotal;
  }, [form, selectedCar]);

  const submit = async () => {
    await orderApi.create({
      customer: form.customer,
      model: selectedCar.name,
      modelId: selectedCar.id,
      color: form.color.name,
      wheels: form.wheels.name,
      interior: form.interior.name,
      packages: form.packages.map((item) => item.name),
      totalPrice: total
    });
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 text-platinum md:px-10">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.5em] text-ember">Commissioning studio</p>
        <h1 className="mt-3 font-display text-7xl md:text-9xl">BUILD YOUR VELOCE</h1>
        <div className="mt-10 h-1 bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-ember to-gold" animate={{ width: `${(step / 4) * 100}%` }} transition={{ ease: "easeOut", duration: 0.45 }} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-h-[520px] border border-white/10 bg-carbon/70 p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-[460px]" />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }} transition={{ duration: 0.35 }}>
                  {step === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      {cars.map((car) => (
                        <button key={car.id} onClick={() => setForm({ ...form, modelId: car.id })} className={`overflow-hidden border text-left transition ${form.modelId === car.id ? "border-gold shadow-gold" : "border-white/10 hover:border-ember"}`}>
                          <img src={car.image} alt={car.name} className="h-52 w-full object-cover" />
                          <div className="p-5">
                            <h3 className="font-display text-4xl">{car.name}</h3>
                            <p className="text-gold">${car.price.toLocaleString()}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <OptionGroup title="Paint" items={colors} selected={form.color} onSelect={(item) => setForm({ ...form, color: item })} colorSwatches />
                      <OptionGroup title="Wheels" items={wheels} selected={form.wheels} onSelect={(item) => setForm({ ...form, wheels: item })} />
                      <OptionGroup title="Interior" items={interiors} selected={form.interior} onSelect={(item) => setForm({ ...form, interior: item })} />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {packages.map((pack) => {
                        const checked = form.packages.some((item) => item.name === pack.name);
                        return (
                          <button
                            key={pack.name}
                            onClick={() =>
                              setForm({
                                ...form,
                                packages: checked ? form.packages.filter((item) => item.name !== pack.name) : [...form.packages, pack]
                              })
                            }
                            className={`flex min-h-36 items-start justify-between border p-5 text-left transition ${checked ? "border-ember bg-ember/10 shadow-glow" : "border-white/10 bg-black/20 hover:border-gold"}`}
                          >
                            <span>
                              <span className="block font-display text-4xl">{pack.name}</span>
                              <span className="text-gold">+${pack.price.toLocaleString()}</span>
                            </span>
                            {checked && <Check className="text-ember" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h2 className="font-display text-6xl">CLIENT DETAILS</h2>
                        {["name", "email", "phone"].map((field) => (
                          <label key={field} className="mt-5 block">
                            <span className="text-sm uppercase tracking-[0.3em] text-platinum/50">{field}</span>
                            <input
                              required
                              value={form.customer[field]}
                              onChange={(event) => setForm({ ...form, customer: { ...form.customer, [field]: event.target.value } })}
                              className="mt-2 w-full border border-white/10 bg-black/40 px-4 py-3 text-lg outline-none focus:border-gold"
                            />
                          </label>
                        ))}
                      </div>
                      <div className="border border-white/10 bg-black/30 p-6">
                        <h2 className="font-display text-6xl">SUMMARY</h2>
                        <Summary label="Model" value={selectedCar?.name} />
                        <Summary label="Paint" value={form.color.name} />
                        <Summary label="Wheels" value={form.wheels.name} />
                        <Summary label="Interior" value={form.interior.name} />
                        <Summary label="Packages" value={form.packages.map((item) => item.name).join(", ") || "None"} />
                        <p className="mt-8 font-display text-6xl text-gold">${total.toLocaleString()}</p>
                        {done ? <p className="mt-4 text-ember">Order saved. The atelier will contact you shortly.</p> : <MagneticButton className="mt-6" onClick={submit}>Submit Order</MagneticButton>}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <aside className="sticky top-28 h-max border border-white/10 bg-black/60 p-6 backdrop-blur">
            {selectedCar && <img src={selectedCar.image} alt={selectedCar.name} className="h-48 w-full object-cover" />}
            <p className="mt-5 text-sm uppercase tracking-[0.3em] text-platinum/50">Live price</p>
            <p className="font-display text-6xl text-gold">${total.toLocaleString()}</p>
            <div className="mt-8 flex gap-3">
              <button disabled={step === 1} onClick={() => setStep(step - 1)} className="grid h-12 flex-1 place-items-center border border-white/15 disabled:opacity-30"><ChevronLeft /></button>
              <button disabled={step === 4} onClick={() => setStep(step + 1)} className="grid h-12 flex-1 place-items-center border border-gold bg-gold text-black disabled:opacity-30"><ChevronRight /></button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function OptionGroup({ title, items, selected, onSelect, colorSwatches = false }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-5xl">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <button key={item.name} onClick={() => onSelect(item)} className={`flex items-center gap-3 border px-4 py-3 ${selected.name === item.name ? "border-gold bg-gold text-black" : "border-white/10 hover:border-ember"}`}>
            {colorSwatches && <span className="h-6 w-6 border border-black/20" style={{ backgroundColor: item.value }} />}
            <span className="font-semibold">{item.name}</span>
            {item.price > 0 && <span>${item.price.toLocaleString()}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="mt-4 flex justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-platinum/50">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
