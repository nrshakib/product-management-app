export const getBaseUrl = () => {
  // You can customize this function to return different base URLs
  // based on environment variables or other logic
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
};
