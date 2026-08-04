import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getImageUrl } from "../utils/getImageUrl";

const statusStyles = {
  pending: "bg-amber-500/20 text-amber-400",
  confirmed: "bg-signal-green/20 text-signal-green",
  ongoing: "bg-blue-500/20 text-blue-400",
  completed: "bg-slate-500/20 text-slate-300",
  cancelled: "bg-signal-red/20 text-signal-red",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold text-slate-100">My bookings</h1>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-signal-red">{error}</p>}

      {!loading && bookings.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-slate-400">You haven't booked any vehicles yet.</p>
          <Link to="/vehicles" className="btn-primary mt-4 inline-flex">Browse vehicles</Link>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-asphalt-800">
              {b.vehicleId?.images?.[0]?.url ? (
                <img src={getImageUrl(b.vehicleId.images[0].url)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-600">No image</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-slate-100">{b.vehicleId?.name || "Vehicle"}</h3>
                <span className={`badge ${statusStyles[b.status]}`}>{b.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} ·{" "}
                <span className="capitalize">{b.rentalType}</span>
              </p>
              <p className="mt-1 font-medium text-amber-400">₹{b.totalPrice}</p>
            </div>

            {["pending", "confirmed"].includes(b.status) && (
              <button
                onClick={() => handleCancel(b._id)}
                disabled={cancellingId === b._id}
                className="btn-secondary self-start text-sm"
              >
                {cancellingId === b._id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
