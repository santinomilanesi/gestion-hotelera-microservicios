import api from '../api/axiosConfig';

const SERVICES = {
  HABITACIONES: '/habitacion-service/habitaciones',
  USUARIOS: '/usuario-service/usuarios',
  RESERVAS: '/reserva-service/reservas'
};

export const RoomService = {
  getAll: () => api.get(SERVICES.HABITACIONES),
  create: (data) => api.post(SERVICES.HABITACIONES, data),
  update: (id, data) => api.put(`${SERVICES.HABITACIONES}/${id}`, data),
  delete: (id) => api.delete(`${SERVICES.HABITACIONES}/${id}`),
  updateStatus: (id, disponible) => api.put(`${SERVICES.HABITACIONES}/${id}`, { disponible })
};

export const UserService = {
  getAll: () => api.get(SERVICES.USUARIOS),
  create: (data) => api.post(SERVICES.USUARIOS, data),
  update: (id, data) => api.put(`${SERVICES.USUARIOS}/${id}`, data),
  delete: (id) => api.delete(`${SERVICES.USUARIOS}/${id}`)
};

export const BookingService = {
  getAll: () => api.get(SERVICES.RESERVAS),
  create: (data) => api.post(SERVICES.RESERVAS, data),
  delete: (id) => api.delete(`${SERVICES.RESERVAS}/${id}`)
};