import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  ["Home", "/"],
  ["Models", "/models"],
  ["Build", "/build"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Admin", "/admin"]
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = ({ isActive }) =>
    `relative text-sm uppercase tracking-[0.26em] transition ${isActive ? "text-gold" : "text-platinum/70 hover:text-platinum"}`;

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-obsidian/78 py-3 shadow-2xl backdrop-blur-xl" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <NavLink to="/" className="min-w-0 flex-shrink font-display text-2xl tracking-[0.12em] text-platinum sm:text-3xl sm:tracking-[0.16em]">
          VELOCE <span className="text-ember">MOTORS</span>
        </NavLink>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <NavLink key={href} to={href} className={navClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="fixed right-5 top-5 z-[60] grid h-11 w-11 flex-shrink-0 place-items-center border border-white/25 bg-black/35 text-platinum backdrop-blur lg:hidden" onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-obsidian/96 backdrop-blur-2xl lg:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.55 }}>
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-3xl tracking-[0.16em] text-gold">VELOCE</span>
              <button className="grid h-11 w-11 place-items-center border border-white/15 text-platinum" onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-5 px-8 pt-16">
              {links.map(([label, href], index) => (
                <motion.div key={href} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.07 }}>
                  <NavLink to={href} onClick={() => setOpen(false)} className="font-display text-6xl text-platinum">
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
