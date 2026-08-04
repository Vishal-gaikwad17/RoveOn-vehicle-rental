const Footer = () => (
  <footer className="mt-20 border-t border-asphalt-700 bg-asphalt-900">
    <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-display text-slate-200">
          <span className="text-amber-500">Rove</span>On
        </p>
        <p>&copy; {new Date().getFullYear()} RoveOn Vehicle Rentals. Built for daily and monthly rides.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
