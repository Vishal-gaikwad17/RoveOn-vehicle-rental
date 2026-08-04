import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/getImageUrl";

const typeLabel = { car: "Car", bike: "Bike", scooter: "Electric Scooter" };
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const VehicleDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rentalType, setRentalType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/vehicles/${id}`), api.get(`/reviews/vehicle/${id}`)])
      .then(([vRes, rRes]) => {
        setVehicle(vRes.data.data);
        setReviews(rRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Vehicle not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Live price estimate, mirrors backend calculatePrice logic
  const estimate = useMemo(() => {
    if (!vehicle || !startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    if (diff <= 0) return null;

    const totalDays = Math.max(1, Math.ceil(diff / MS_PER_DAY));
    if (rentalType === "monthly") {
      const totalMonths = Math.max(1, Math.ceil(totalDays / 30));
      return { totalDays, totalMonths, totalPrice: totalMonths * vehicle.pricePerMonth };
    }
    return { totalDays, totalMonths: null, totalPrice: totalDays * vehicle.pricePerDay };
  }, [vehicle, startDate, endDate, rentalType]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      setBookingError("Please select both start and end dates");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bookings", { vehicleId: id, rentalType, startDate, endDate });
      setBookingSuccess("Booking created! Check My Bookings for status.");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="mx-auto max-w-5xl px-4 py-10 text-slate-500">Loading vehicle...</p>;
  if (error) return <p className="mx-auto max-w-5xl px-4 py-10 text-signal-red">{error}</p>;
  if (!vehicle) return null;

  const image = vehicle.images?.[activeImage]?.url;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-asphalt-700 bg-asphalt-800">
            {image ? (
              <img src={getImageUrl(image)} alt={vehicle.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">No image available</div>
            )}
          </div>
          {vehicle.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border ${
                    i === activeImage ? "border-amber-500" : "border-asphalt-700"
                  }`}
                >
                  <img src={getImageUrl(img.url)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details + booking form */}
        <div>
          <span className="badge bg-asphalt-800 text-amber-400">{typeLabel[vehicle.type]}</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-100">{vehicle.name}</h1>
          {vehicle.brand && <p className="text-slate-500">{vehicle.brand}</p>}

          <div className="mt-4 flex items-center gap-4">
            <span
              className={`badge ${
                vehicle.available ? "bg-signal-green/20 text-signal-green" : "bg-signal-red/20 text-signal-red"
              }`}
            >
              {vehicle.available ? "Available" : "Currently unavailable"}
            </span>
            {vehicle.type === "scooter" && vehicle.batteryStatus !== undefined && (
              <span className="text-sm text-slate-400">Battery: {vehicle.batteryStatus}%</span>
            )}
            {vehicle.ratingsCount > 0 && (
              <span className="text-sm text-slate-400">★ {vehicle.ratingsAverage.toFixed(1)} ({vehicle.ratingsCount} reviews)</span>
            )}
          </div>

          {vehicle.description && <p className="mt-4 text-slate-400">{vehicle.description}</p>}

          <div className="mt-5 flex gap-8">
            <div>
              <p className="text-2xl font-bold text-amber-400">₹{vehicle.pricePerDay}</p>
              <p className="text-xs text-slate-500">per day</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">₹{vehicle.pricePerMonth}</p>
              <p className="text-xs text-slate-500">per month</p>
            </div>
          </div>

          {/* Booking form */}
          <form onSubmit={handleBooking} className="card mt-8 space-y-4 p-5">
            <h3 className="font-display text-lg font-semibold text-slate-100">Book this ride</h3>

            <div className="flex gap-3">
              {["daily", "monthly"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setRentalType(t)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                    rentalType === t
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-asphalt-600 text-slate-400 hover:border-asphalt-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Start date</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">End date</label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {estimate && (
              <div className="rounded-lg bg-asphalt-800 p-3 text-sm text-slate-300">
                <p>
                  {estimate.totalDays} day{estimate.totalDays > 1 ? "s" : ""}
                  {estimate.totalMonths ? ` (~${estimate.totalMonths} month${estimate.totalMonths > 1 ? "s" : ""})` : ""}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-amber-400">
                  Estimated total: ₹{estimate.totalPrice}
                </p>
              </div>
            )}

            {bookingError && <p className="text-sm text-signal-red">{bookingError}</p>}
            {bookingSuccess && <p className="text-sm text-signal-green">{bookingSuccess}</p>}

            <button type="submit" disabled={!vehicle.available || submitting} className="btn-primary w-full">
              {submitting ? "Booking..." : vehicle.available ? "Confirm booking" : "Unavailable"}
            </button>
            {!user && <p className="text-center text-xs text-slate-500">You'll need to log in to complete booking.</p>}
          </form>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-100">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-slate-500">No reviews yet for this vehicle.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{r.userId?.name || "Anonymous"}</span>
                  <span className="text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-slate-400">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
