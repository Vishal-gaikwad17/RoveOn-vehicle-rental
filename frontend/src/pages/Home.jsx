import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import VehicleCard from "../components/VehicleCard";

const categories = [
  { type: "car", label: "Cars", tagline: "For road trips & family runs" },
  { type: "bike", label: "Bikes", tagline: "For quick city commutes" },
  { type: "scooter", label: "E-Scooters", tagline: "Zero-emission, zero-fuss" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/vehicles", { params: { limit: 6, sort: "rating" } })
      .then((res) => setFeatured(res.data.data))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-asphalt-700 bg-asphalt-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-amber-500">
              Daily or monthly. Your call.
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">
              Every ride, <span className="text-amber-500">rented on your terms.</span>
            </h1>
            <p className="mt-4 max-w-md text-slate-400">
              Cars for the road trip, bikes for the commute, electric scooters for the last mile —
              pick a duration, pick your dates, ride off.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/vehicles" className="btn-primary">Browse all vehicles</Link>
              <Link to="/vehicles?type=scooter" className="btn-secondary">Explore e-scooters</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link
                key={c.type}
                to={`/vehicles?type=${c.type}`}
                className="card flex flex-col items-center justify-center gap-2 p-6 text-center transition hover:-translate-y-1 hover:border-amber-500/50"
              >
                <span className="font-display text-base font-semibold text-slate-100">{c.label}</span>
                <span className="text-xs text-slate-500">{c.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-100">Top rated rides</h2>
          <Link to="/vehicles" className="text-sm font-medium text-amber-400 hover:text-amber-300">
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-slate-500">No vehicles available yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
