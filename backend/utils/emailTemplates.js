const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/**
 * Email sent to the admin whenever a new booking is created.
 */
const bookingNotificationTemplate = ({ booking, vehicle, user }) => {
  const subject = `New booking: ${vehicle.name} (${user.name})`;

  const text = `New booking received.

Vehicle: ${vehicle.name} (${vehicle.type})
Customer: ${user.name} <${user.email}>
Rental type: ${booking.rentalType}
Dates: ${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}
Total price: Rs. ${booking.totalPrice}
Status: ${booking.status}
Booking ID: ${booking._id}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #DC8A0E;">New booking received</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #666;">Vehicle</td><td style="padding: 6px 0;"><strong>${vehicle.name}</strong> (${vehicle.type})</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Customer</td><td style="padding: 6px 0;">${user.name} (${user.email})</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Rental type</td><td style="padding: 6px 0; text-transform: capitalize;">${booking.rentalType}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Start date</td><td style="padding: 6px 0;">${formatDate(booking.startDate)}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">End date</td><td style="padding: 6px 0;">${formatDate(booking.endDate)}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Total price</td><td style="padding: 6px 0;"><strong>&#8377;${booking.totalPrice}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Status</td><td style="padding: 6px 0; text-transform: capitalize;">${booking.status}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Booking ID</td><td style="padding: 6px 0; font-family: monospace;">${booking._id}</td></tr>
      </table>
    </div>
  `;

  return { subject, text, html };
};

module.exports = { bookingNotificationTemplate };
