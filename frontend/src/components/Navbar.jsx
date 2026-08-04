import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-asphalt-700 bg-asphalt-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-slate-50">
          <span className="text-amber-500">Rove</span>On
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <Link to="/vehicles?type=car" className="hover:text-amber-400">Cars</Link>
          <Link to="/vehicles?type=bike" className="hover:text-amber-400">Bikes</Link>
          <Link to="/vehicles?type=scooter" className="hover:text-amber-400">Scooters</Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-amber-400">My Bookings</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-amber-400">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-400 sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
