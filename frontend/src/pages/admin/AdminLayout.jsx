import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/vehicles", label: "Vehicles" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/users", label: "Users" },
];

const AdminLayout = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <h1 className="mb-6 font-display text-3xl font-bold text-slate-100">Admin dashboard</h1>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="card flex h-max flex-row overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-amber-500 text-asphalt-950" : "text-slate-400 hover:bg-asphalt-800 hover:text-slate-200"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
