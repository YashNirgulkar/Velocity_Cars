export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-platinum/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-5xl tracking-[0.12em] text-platinum">VELOCE</p>
          <p className="mt-2 max-w-lg">Hand-built performance machines, electrified grand touring, and private commissioning for a new era of luxury motion.</p>
        </div>
        <div className="flex gap-5 text-sm uppercase tracking-[0.25em]">
          <a href="https://instagram.com" className="hover:text-gold">Instagram</a>
          <a href="https://x.com" className="hover:text-gold">X</a>
          <a href="https://youtube.com" className="hover:text-gold">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
