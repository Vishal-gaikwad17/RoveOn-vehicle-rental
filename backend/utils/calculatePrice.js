const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calculates total rental price.
 * - daily: price per day * number of days (minimum 1 day)
 * - monthly: price per month * number of whole/partial months (minimum 1 month)
 */
const calculatePrice = (vehicle, startDate, endDate, rentalType) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end - start;
  if (diffMs <= 0) {
    throw new Error("endDate must be after startDate");
  }

  const totalDays = Math.max(1, Math.ceil(diffMs / MS_PER_DAY));

  if (rentalType === "monthly") {
    const totalMonths = Math.max(1, Math.ceil(totalDays / 30));
    return {
      totalPrice: totalMonths * vehicle.pricePerMonth,
      totalDays,
      totalMonths,
    };
  }

  // daily
  return {
    totalPrice: totalDays * vehicle.pricePerDay,
    totalDays,
    totalMonths: null,
  };
};

module.exports = calculatePrice;
