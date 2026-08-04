const Filters = ({ filters, setFilters, onApply }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="card h-max space-y-5 p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-400">
        Filter
      </h3>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Search</label>
        <input
          type="text"
          placeholder="Search by name or brand"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Type</label>
        <select value={filters.type} onChange={(e) => update("type", e.target.value)} className="input-field">
          <option value="">All types</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="scooter">Electric Scooter</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Min ₹/day</label>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Max ₹/day</label>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Availability</label>
        <select
          value={filters.available}
          onChange={(e) => update("available", e.target.value)}
          className="input-field"
        >
          <option value="">Any</option>
          <option value="true">Available now</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Sort by</label>
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="input-field">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <button onClick={onApply} className="btn-primary w-full">
        Apply filters
      </button>
    </aside>
  );
};

export default Filters;
