import { useState, useEffect, useCallback } from 'react';
import { RoomService, UserService, BookingService } from '../services/apiService';

export const useAdminData = () => {
    const [data, setData] = useState({ habitaciones: [], usuarios: [], reservas: [] });
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [h, u, r] = await Promise.all([
                RoomService.getAll(),
                UserService.getAll(),
                BookingService.getAll()
            ]);

            // JOIN DE DATOS: Cruzamos Reservas con Usuarios y Habitaciones
            const reservasEnriquecidas = r.data.map(res => {
                const cliente = u.data.find(user => user.id === res.usuarioId);
                const habitacion = h.data.find(hab => hab.id === res.habitacionId);
                return {
                    ...res,
                    huespedNombre: cliente ? cliente.nombre : 'Usuario N/A',
                    huespedDni: cliente ? cliente.dni : 'N/A',
                    nroHabitacion: habitacion ? habitacion.numero : '?',
                };
            });

            setData({ 
                habitaciones: h.data, 
                usuarios: u.data, 
                reservas: reservasEnriquecidas 
            });
        } catch (err) {
            console.error("Error en Gateway:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    return { ...data, loading, refresh };
};