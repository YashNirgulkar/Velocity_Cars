import { motion } from "framer-motion";
import { LogOut, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { carApi, contactApi, orderApi } from "../api/endpoints";
import MagneticButton from "../components/MagneticButton";
import Skeleton from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";

const emptyCar = {
  name: "",
  category: "Sports",
  price: "",
  hp: "",
  topSpeed: "",
  image: "",
  description: "",
  accent: "#d63f31"
};

export default function Admin() {
  const { user, login, logout } = useAuth();
  const [credentials, setCredentials] = useState({ email: "admin@veloce.com", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCar, setNewCar] = useState(emptyCar);

  const loadAdmin = async () => {
    setLoading(true);
    const [orderRes, contactRes, carRes] = await Promise.all([orderApi.all(), contactApi.all(), carApi.all()]);
    setOrders(orderRes.data);
    setMessages(contactRes.data);
    setCars(carRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadAdmin();
  }, [user]);

  const doLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    }
  };

  const addCar = async (event) => {
    event.preventDefault();
    await carApi.create({
      ...newCar,
      price: Number(newCar.price),
      hp: Number(newCar.hp),
      topSpeed: Number(newCar.topSpeed)
    });
    setNewCar(emptyCar);
    loadAdmin();
  };

  const deleteCar = async (id) => {
    await carApi.remove(id);
    loadAdmin();
  };

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-obsidian px-6 py-28 text-platinum">
        <motion.form onSubmit={doLogin} className="w-full max-w-md border border-white/10 bg-carbon p-8 shadow-2xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.5em] text-gold">Admin access</p>
          <h1 className="mt-3 font-display text-7xl">VELOCE HQ</h1>
          <label className="mt-8 block">
            <span className="text-sm uppercase tracking-[0.3em] text-platinum/55">Email</span>
            <input value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} className="mt-2 w-full border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-gold" />
          </label>
          <label className="mt-5 block">
            <span className="text-sm uppercase tracking-[0.3em] text-platinum/55">Password</span>
            <input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="mt-2 w-full border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-gold" />
          </label>
          <MagneticButton className="mt-8 w-full justify-center" type="submit">Login</MagneticButton>
          {loginError && <p className="mt-4 text-ember">{loginError}</p>}
        </motion.form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 text-platinum md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-gold">Secure dashboard</p>
            <h1 className="mt-3 font-display text-7xl md:text-9xl">HQ CONTROL</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-sm uppercase tracking-[0.25em] hover:border-ember hover:text-ember">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {loading ? (
          <Skeleton className="mt-10 h-[600px]" />
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Stat title="Orders" value={orders.length} />
              <Stat title="Cars" value={cars.length} />
              <Stat title="Messages" value={messages.length} />
            </div>

            <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
              <Panel title="Orders">
                <Table
                  headers={["Client", "Model", "Total", "Status"]}
                  rows={orders.map((order) => [order.customer?.name, order.model, `$${Number(order.totalPrice).toLocaleString()}`, order.status])}
                />
              </Panel>
              <Panel title="Contact">
                <Table headers={["Name", "Subject", "Email"]} rows={messages.map((message) => [message.name, message.subject, message.email])} />
              </Panel>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[.9fr_1.1fr]">
              <Panel title="Add New Car">
                <form onSubmit={addCar} className="grid gap-4 md:grid-cols-2">
                  {["name", "price", "hp", "topSpeed", "image", "description"].map((field) => (
                    <input
                      key={field}
                      required
                      placeholder={field}
                      value={newCar[field]}
                      onChange={(event) => setNewCar({ ...newCar, [field]: event.target.value })}
                      className={`border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-gold ${field === "description" || field === "image" ? "md:col-span-2" : ""}`}
                    />
                  ))}
                  <select value={newCar.category} onChange={(event) => setNewCar({ ...newCar, category: event.target.value })} className="border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-gold">
                    {["SUV", "Sedan", "Sports", "Electric"].map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                  <input type="color" value={newCar.accent} onChange={(event) => setNewCar({ ...newCar, accent: event.target.value })} className="h-12 w-full border border-white/10 bg-black/40" />
                  <MagneticButton className="justify-center md:col-span-2" type="submit">Add Car</MagneticButton>
                </form>
              </Panel>
              <Panel title="Cars">
                <div className="space-y-3">
                  {cars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between gap-3 border border-white/10 bg-black/25 p-3">
                      <div>
                        <p className="font-display text-3xl">{car.name}</p>
                        <p className="text-sm uppercase tracking-[0.25em] text-gold">{car.category}</p>
                      </div>
                      <button onClick={() => deleteCar(car.id)} className="grid h-11 w-11 place-items-center border border-ember/60 text-ember hover:bg-ember hover:text-white">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="border border-white/10 bg-carbon p-6">
      <p className="text-sm uppercase tracking-[0.35em] text-platinum/50">{title}</p>
      <p className="font-display text-7xl text-gold">{value}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="border border-white/10 bg-carbon/70 p-5">
      <h2 className="mb-5 font-display text-5xl">{title}</h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left">
        <thead>
          <tr className="border-b border-white/10 text-sm uppercase tracking-[0.24em] text-platinum/45">
            {headers.map((header) => <th key={header} className="py-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="py-5 text-platinum/45" colSpan={headers.length}>No records yet.</td></tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="border-b border-white/5">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="py-3 pr-4 text-platinum/75">{cell}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
