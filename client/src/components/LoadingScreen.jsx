import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-obsidian"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: "easeInOut" } }}
        >
          <div className="text-center">
            <motion.p
              className="font-display text-7xl tracking-[0.18em] text-platinum md:text-9xl"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            >
              VELOCE
            </motion.p>
            <div className="mt-5 h-px w-72 overflow-hidden bg-platinum/15">
              <motion.div
                className="h-full bg-gradient-to-r from-ember via-gold to-ember"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
