// export const API_URL = "http://10.1.104.5:5000";

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "http://10.1.104.5:5000";
