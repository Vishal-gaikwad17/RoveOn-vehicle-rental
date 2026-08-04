import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

const typeLabel = { car: "Car", bike: "Bike", scooter: "E-Scooter" };

const VehicleCard = ({ vehicle }) => {
  const image = vehicle.images?.[0]?.url;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:border-amber-500/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-asphalt-800">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={vehicle.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">No image</div>
        )}
        <span className="badge absolute left-3 top-3 bg-asphalt-950/80 text-amber-400">
          {typeLabel[vehicle.type]}
        </span>
        <span
          className={`badge absolute right-3 top-3 ${
            vehicle.available ? "bg-signal-green/20 text-signal-green" : "bg-signal-red/20 text-signal-red"
          }`}
        >
          {vehicle.available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-slate-100">{vehicle.name}</h3>
        {vehicle.brand && <p className="text-xs text-slate-500">{vehicle.brand}</p>}

        {vehicle.type === "scooter" && vehicle.batteryStatus !== undefined && (
          <p className="mt-1 text-xs text-signal-green">Battery: {vehicle.batteryStatus}%</p>
        )}

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-amber-400">₹{vehicle.pricePerDay}<span className="text-xs font-normal text-slate-500">/day</span></p>
            <p className="text-xs text-slate-500">₹{vehicle.pricePerMonth}/month</p>
          </div>
          {vehicle.ratingsCount > 0 && (
            <span className="text-xs text-slate-400">★ {vehicle.ratingsAverage.toFixed(1)} ({vehicle.ratingsCount})</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
