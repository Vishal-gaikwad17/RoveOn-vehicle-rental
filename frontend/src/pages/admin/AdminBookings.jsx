import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusOptions = ["pending", "confirmed", "ongoing", "completed", "cancelled"];

const statusStyles = {
  pending: "bg-amber-500/20 text-amber-400",
  confirmed: "bg-signal-green/20 text-signal-green",
  ongoing: "bg-blue-500/20 text-blue-400",
  completed: "bg-slate-500/20 text-slate-300",
  cancelled: "bg-signal-red/20 text-signal-red",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await api.get("/bookings", { params });
      setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-slate-100">Bookings</h2>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-48">
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-500">Loading bookings...</p>}

      <div className="overflow-x-auto rounded-xl border border-asphalt-700">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-asphalt-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-700">
            {bookings.map((b) => (
              <tr key={b._id} className="bg-asphalt-900">
                <td className="px-4 py-3 font-medium text-slate-100">{b.vehicleId?.name}</td>
                <td className="px-4 py-3 text-slate-400">
                  {b.userId?.name}
                  <div className="text-xs text-slate-600">{b.userId?.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-amber-400">₹{b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusStyles[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={b.status}
                    disabled={updatingId === b._id}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="input-field !w-40 !py-1.5 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && bookings.length === 0 && (
          <p className="p-6 text-center text-slate-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
