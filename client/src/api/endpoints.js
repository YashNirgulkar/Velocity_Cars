import api from "./client";

export const carApi = {
  all: (category) => api.get("/cars", { params: category && category !== "All" ? { category } : {} }),
  one: (id) => api.get(`/cars/${id}`),
  create: (payload) => api.post("/cars", payload),
  remove: (id) => api.delete(`/cars/${id}`)
};

export const orderApi = {
  all: () => api.get("/orders"),
  create: (payload) => api.post("/orders", payload)
};

export const contactApi = {
  all: () => api.get("/contact"),
  create: (payload) => api.post("/contact", payload)
};

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me")
};
