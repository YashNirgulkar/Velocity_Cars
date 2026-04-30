import { Link } from "react-router-dom";
import MagneticButton from "../components/MagneticButton";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-obsidian px-6 text-center text-platinum">
      <div>
        <p className="font-display text-[10rem] leading-none text-ember">404</p>
        <h1 className="font-display text-7xl">ROAD NOT FOUND</h1>
        <p className="mx-auto mt-4 max-w-lg text-xl text-platinum/65">This route left the production line before final inspection.</p>
        <MagneticButton as={Link} to="/" className="mt-8">Return Home</MagneticButton>
      </div>
    </main>
  );
}
