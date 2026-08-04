import { useEffect, useState } from "react";
import api from "../../api/axios";

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 font-display text-3xl font-bold text-amber-400">{value}</p>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, users: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vehiclesRes, bookingsRes, usersRes] = await Promise.all([
          api.get("/vehicles", { params: { limit: 1 } }),
          api.get("/bookings"),
          api.get("/users"),
        ]);
        const bookings = bookingsRes.data.data;
        setStats({
          vehicles: vehiclesRes.data.total,
          bookings: bookings.length,
          users: usersRes.data.count,
          pending: bookings.filter((b) => b.status === "pending").length,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-slate-500">Loading stats...</p>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Total vehicles" value={stats.vehicles} />
      <StatCard label="Total bookings" value={stats.bookings} />
      <StatCard label="Registered users" value={stats.users} />
      <StatCard label="Pending bookings" value={stats.pending} />
    </div>
  );
};

export default AdminOverview;
