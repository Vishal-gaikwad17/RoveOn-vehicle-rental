import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl font-bold text-amber-500">404</p>
    <h1 className="mt-2 font-display text-xl font-semibold text-slate-100">Wrong turn.</h1>
    <p className="mt-2 text-slate-500">This page doesn't exist. Let's get you back on route.</p>
    <Link to="/" className="btn-primary mt-6">Back to home</Link>
  </div>
);

export default NotFound;
