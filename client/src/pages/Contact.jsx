import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { contactApi } from "../api/endpoints";
import MagneticButton from "../components/MagneticButton";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("Sending...");
    await contactApi.create(form);
    setForm({ name: "", email: "", subject: "", message: "" });
    setStatus("Message saved. A Veloce concierge will respond soon.");
  };

  return (
    <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 text-platinum md:px-10">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm uppercase tracking-[0.5em] text-gold">Concierge</p>
          <h1 className="mt-3 font-display text-8xl md:text-[10rem]">CONTACT</h1>
          <div className="mt-10 space-y-5 text-xl text-platinum/70">
            <p className="flex items-center gap-4"><MapPin className="text-ember" /> Atelier District, Modena, Italy</p>
            <p className="flex items-center gap-4"><Phone className="text-ember" /> +39 059 000 1984</p>
            <p className="flex items-center gap-4"><Mail className="text-ember" /> concierge@veloce.com</p>
          </div>
          <div className="mt-10 flex gap-4 text-sm uppercase tracking-[0.28em] text-gold">
            <a href="https://instagram.com" className="hover:text-ember">Instagram</a>
            <a href="https://linkedin.com" className="hover:text-ember">LinkedIn</a>
          </div>
          <div className="mt-12 grid h-72 place-items-center border border-white/10 bg-[linear-gradient(135deg,#101113,#050505)]">
            <p className="text-sm uppercase tracking-[0.4em] text-platinum/45">Styled map placeholder</p>
          </div>
        </motion.div>

        <motion.form onSubmit={submit} className="border border-white/10 bg-carbon/75 p-6 md:p-10" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          {["name", "email", "subject"].map((field) => (
            <label key={field} className="group relative mt-8 block first:mt-0">
              <input
                required
                value={form[field]}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                className="peer w-full border-b border-white/15 bg-transparent pb-3 pt-6 text-xl outline-none focus:border-gold"
                placeholder=" "
              />
              <span className="absolute left-0 top-6 text-sm uppercase tracking-[0.3em] text-platinum/50 transition peer-focus:top-0 peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0">
                {field}
              </span>
            </label>
          ))}
          <label className="group relative mt-8 block">
            <textarea
              required
              rows="7"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              className="peer w-full resize-none border-b border-white/15 bg-transparent pb-3 pt-6 text-xl outline-none focus:border-gold"
              placeholder=" "
            />
            <span className="absolute left-0 top-6 text-sm uppercase tracking-[0.3em] text-platinum/50 transition peer-focus:top-0 peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0">
              Message
            </span>
          </label>
          <MagneticButton className="mt-8" type="submit">Transmit</MagneticButton>
          {status && <p className="mt-5 text-gold">{status}</p>}
        </motion.form>
      </section>
    </main>
  );
}
