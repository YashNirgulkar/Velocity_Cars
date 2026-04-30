import { motion } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";

const timeline = [
  ["1984", "VELOCE begins as a private engineering atelier in Modena."],
  ["1996", "First carbon monocoque grand tourer enters limited production."],
  ["2008", "Hybrid torque-fill technology debuts in endurance prototypes."],
  ["2021", "The Eon electric platform rewrites the brand's performance language."],
  ["2026", "Veloce Atelier opens private commissions across four continents."]
];

const team = [
  ["Alessio Riva", "Chief Design Officer", "Sculpts every surface around tension, shadow, and motion."],
  ["Mira Sen", "Head of Electric Propulsion", "Owns the 900-volt architecture and torque systems."],
  ["Jonas Vale", "Atelier Director", "Turns client obsessions into one-of-one cabin craft."]
];

export default function About() {
  return (
    <main className="bg-obsidian text-platinum">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-6 pt-28 md:px-10">
        <div className="absolute inset-0 bg-noise opacity-80" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
        <motion.div className="relative z-10 max-w-5xl text-center" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
          <p className="text-sm uppercase tracking-[0.5em] text-gold">Bloodline</p>
          <h1 className="mt-4 font-display text-[18vw] leading-[0.8] md:text-[11rem]">BUILT IN SHADOW. SEEN IN FIRE.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-platinum/70">Veloce Motors builds for clients who want silence, violence, and ceremony in the same machine.</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <h2 className="font-display text-7xl md:text-9xl">TIMELINE</h2>
        <div className="mt-10 border-l border-gold/35">
          {timeline.map(([year, text], index) => (
            <motion.div key={year} className="relative pl-8 pb-12" initial={{ opacity: 0, x: index % 2 ? 70 : -70 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <span className="absolute -left-3 top-1 h-6 w-6 border border-gold bg-obsidian" />
              <p className="font-display text-6xl text-ember">{year}</p>
              <p className="mt-2 max-w-2xl text-xl text-platinum/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3 md:px-10">
        <AnimatedCounter value="22000" suffix="+" label="Cars Sold" />
        <AnimatedCounter value="38" label="Countries" />
        <AnimatedCounter value="124" label="Awards" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <h2 className="font-display text-7xl">THE COUNCIL</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map(([name, role, bio]) => (
            <motion.article key={name} className="group h-80 [perspective:1000px]" whileHover={{ scale: 1.02 }}>
              <div className="relative h-full transition duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 grid place-items-end border border-white/10 bg-gunmetal p-6 [backface-visibility:hidden]">
                  <div>
                    <p className="font-display text-5xl">{name}</p>
                    <p className="text-gold">{role}</p>
                  </div>
                </div>
                <div className="absolute inset-0 grid place-items-center border border-ember bg-ember/15 p-7 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="text-xl text-platinum/80">{bio}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
