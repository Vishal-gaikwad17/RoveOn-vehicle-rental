import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  type: "car",
  brand: "",
  description: "",
  pricePerDay: "",
  pricePerMonth: "",
  available: true,
  seats: "",
  fuelType: "none",
  batteryStatus: "",
  city: "",
};

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/vehicles", { params: { limit: 100 } });
      setVehicles(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFiles([]);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (v) => {
    setForm({
      name: v.name,
      type: v.type,
      brand: v.brand || "",
      description: v.description || "",
      pricePerDay: v.pricePerDay,
      pricePerMonth: v.pricePerMonth,
      available: v.available,
      seats: v.seats || "",
      fuelType: v.fuelType || "none",
      batteryStatus: v.batteryStatus ?? "",
      city: v.location?.city || "",
    });
    setEditingId(v._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) fd.append(key, value);
      });
      imageFiles.forEach((file) => fd.append("images", file));

      if (editingId) {
        await api.put(`/vehicles/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/vehicles", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      resetForm();
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const toggleAvailability = async (v) => {
    try {
      await api.patch(`/vehicles/${v._id}/availability`, { available: !v.available });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability");
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-slate-100">Vehicles</h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="btn-primary text-sm"
        >
          {showForm ? "Close form" : "+ Add vehicle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
            <input
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Type</label>
            <select
              className="input-field"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="scooter">Electric Scooter</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Brand</label>
            <input
              className="input-field"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">City</label>
            <input
              className="input-field"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Price per day (₹)</label>
            <input
              type="number"
              min="0"
              required
              className="input-field"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Price per month (₹)</label>
            <input
              type="number"
              min="0"
              required
              className="input-field"
              value={form.pricePerMonth}
              onChange={(e) => setForm({ ...form, pricePerMonth: e.target.value })}
            />
          </div>

          {form.type === "car" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Seats</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
              />
            </div>
          )}

          {form.type === "scooter" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Battery status (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={form.batteryStatus}
                onChange={(e) => setForm({ ...form, batteryStatus: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Fuel type</label>
            <select
              className="input-field"
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
            >
              <option value="none">N/A</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="available"
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="h-4 w-4 accent-amber-500"
            />
            <label htmlFor="available" className="text-sm text-slate-300">Available for booking</label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="input-field file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-asphalt-950"
            />
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : editingId ? "Update vehicle" : "Create vehicle"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-slate-500">Loading vehicles...</p>}
      {error && <p className="text-signal-red">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-asphalt-700">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-asphalt-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">₹/day</th>
              <th className="px-4 py-3">₹/month</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-700">
            {vehicles.map((v) => (
              <tr key={v._id} className="bg-asphalt-900">
                <td className="px-4 py-3 font-medium text-slate-100">{v.name}</td>
                <td className="px-4 py-3 capitalize text-slate-400">{v.type}</td>
                <td className="px-4 py-3 text-slate-300">₹{v.pricePerDay}</td>
                <td className="px-4 py-3 text-slate-300">₹{v.pricePerMonth}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailability(v)}
                    className={`badge ${
                      v.available ? "bg-signal-green/20 text-signal-green" : "bg-signal-red/20 text-signal-red"
                    }`}
                  >
                    {v.available ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(v)} className="mr-3 text-amber-400 hover:text-amber-300">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(v._id)} className="text-signal-red hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVehicles;
