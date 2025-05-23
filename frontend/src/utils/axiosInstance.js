import axios from "axios"

const BASE_URL = "https://personal-travel-diary-app.onrender.com"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default axiosInstance
