// Cloudinary URLs are already absolute (https://res.cloudinary.com/...).
// Local disk storage URLs are relative (/uploads/xyz.jpg) and need to be
// resolved against the backend's origin, not the frontend's.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

export const getImageUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url}`;
};
