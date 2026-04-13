package com.microservicios.reserva_service.service;

import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservicios.reserva_service.client.HabitacionFeignClient;
import com.microservicios.reserva_service.client.UsuarioFeignClient;
import com.microservicios.reserva_service.dto.HabitacionDTO;
import com.microservicios.reserva_service.model.EstadoReserva;
import com.microservicios.reserva_service.model.Reserva;
import com.microservicios.reserva_service.repository.ReservaRepository;

@Service
public class ReservaService {

    private final ReservaRepository repo;
    private final UsuarioFeignClient uClient;
    private final HabitacionFeignClient hClient;

    public ReservaService(ReservaRepository repo, UsuarioFeignClient uClient, HabitacionFeignClient hClient) {
        this.repo = repo;
        this.uClient = uClient;
        this.hClient = hClient;
    }

    @Transactional
    public Reserva crearReserva(Reserva reserva) {
        System.out.println("--- INICIANDO DIAGNÓSTICO DE RESERVA ---");

        // 1. Validar Usuario
        try {
            System.out.println("DEBUG: Llamando a usuario-service para ID: " + reserva.getUsuarioId());
            uClient.obtenerUsuarioPorId(reserva.getUsuarioId());
            System.out.println("DEBUG: Usuario validado correctamente.");
        } catch (Exception e) {
            System.err.println("!!! ERROR EN LLAMADA A USUARIOS !!!");
            e.printStackTrace();
            throw new RuntimeException("Fallo en usuario-service: " + e.getMessage());
        }

        // 2. Validar Habitación
        HabitacionDTO h;
        try {
            System.out.println("DEBUG: Llamando a habitacion-service para ID: " + reserva.getUsuarioId());
            h = hClient.obtenerHabitacionPorId(reserva.getHabitacionId());
            if (h == null) throw new RuntimeException("El microservicio devolvió NULL");
            System.out.println("DEBUG: Habitación encontrada: " + h.getNumero() + " - Precio: " + h.getPrecio());
        } catch (Exception e) {
            System.err.println("!!! ERROR EN LLAMADA A HABITACIONES (GET) !!!");
            e.printStackTrace(); 
            throw new RuntimeException("Fallo en habitacion-service (GET): " + e.getMessage());
        }

        if (!h.isDisponible()) {
            throw new RuntimeException("Error: La habitación #" + h.getNumero() + " no está disponible.");
        }

        // 3. Cálculos
        long noches = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin());
        if (noches <= 0) noches = 1; 
        reserva.setMontoTotal(noches * h.getPrecio());
        reserva.setEstado(EstadoReserva.CONFIRMADA);

        // 4. Persistencia local
        Reserva nueva = repo.save(reserva);
        System.out.println("DEBUG: Reserva guardada localmente con ID: " + nueva.getId());

        // 5. Actualización de disponibilidad (PUT)
        try {
            System.out.println("DEBUG: Preparando objeto para actualizar disponibilidad...");
            HabitacionDTO datosEstado = new HabitacionDTO();
            datosEstado.setDisponible(false); // La marcamos como ocupada
            
            hClient.actualizarEstado(reserva.getHabitacionId(), datosEstado);
            System.out.println("DEBUG: Estado de habitación actualizado exitosamente.");
        } catch (Exception e) {
            System.err.println("!!! ERROR EN LLAMADA A HABITACIONES (PUT) !!!");
            e.printStackTrace();
            throw new RuntimeException("Fallo al actualizar disponibilidad: " + e.getMessage());
        }

        System.out.println("--- DIAGNÓSTICO FINALIZADO CON ÉXITO ---");
        return nueva;
    }

    public List<Reserva> listarTodas() {
        return repo.findAll();
    }

    @Transactional
    public void eliminarReserva(Long id) {
        Reserva r = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        
        try {
            HabitacionDTO liberar = new HabitacionDTO();
            liberar.setDisponible(true);
            hClient.actualizarEstado(r.getHabitacionId(), liberar);
        } catch (Exception e) {
            System.err.println("Error al liberar habitación durante borrado.");
        }
        repo.deleteById(id);
    }
}