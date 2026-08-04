import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import VehicleCard from "../components/VehicleCard";
import Filters from "../components/Filters";

const emptyFilters = { search: "", type: "", minPrice: "", maxPrice: "", available: "", sort: "newest" };

const VehicleList = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...emptyFilters, type: searchParams.get("type") || "" });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchVehicles = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      setError("");
      try {
        const params = { ...filters, page: pageNum, limit: 9 };
        Object.keys(params).forEach((k) => params[k] === "" && delete params[k]);
        const { data } = await api.get("/vehicles", { params });
        setVehicles(data.data);
        setPages(data.pages || 1);
        setPage(data.page || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchVehicles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold text-slate-100">Browse vehicles</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Filters filters={filters} setFilters={setFilters} onApply={() => fetchVehicles(1)} />

        <div>
          {loading && <p className="text-slate-500">Loading vehicles...</p>}
          {error && <p className="text-signal-red">{error}</p>}

          {!loading && !error && vehicles.length === 0 && (
            <p className="text-slate-500">No vehicles match your filters. Try adjusting them.</p>
          )}

          {!loading && vehicles.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchVehicles(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                        p === page
                          ? "bg-amber-500 text-asphalt-950"
                          : "bg-asphalt-800 text-slate-300 hover:bg-asphalt-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
