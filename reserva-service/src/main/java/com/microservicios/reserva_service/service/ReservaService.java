package com.microservicios.reserva_service.service;

import com.microservicios.reserva_service.client.HabitacionFeignClient;
import com.microservicios.reserva_service.client.UsuarioFeignClient;
import com.microservicios.reserva_service.dto.HabitacionDTO;
import com.microservicios.reserva_service.model.Reserva;
import com.microservicios.reserva_service.repository.ReservaRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository repo;
    private final UsuarioFeignClient uClient;
    private final HabitacionFeignClient hClient;

    public ReservaService(ReservaRepository repo, 
                          UsuarioFeignClient uClient, 
                          HabitacionFeignClient hClient) {
        this.repo = repo;
        this.uClient = uClient;
        this.hClient = hClient;
    }

    /**
     * @Transactional asegura que si la llamada a hClient falla, 
     * la reserva no se guarde en la DB (Rollback).
     */
    @Transactional
    @CircuitBreaker(name = "reservaCB", fallbackMethod = "falloReserva")
    public Reserva crearReserva(Reserva reserva) {
        // 1. Validar Usuario (Llamada externa a usuario-service)
        uClient.obtenerUsuarioPorId(reserva.getUsuarioId());

        // 2. Validar Habitación (Llamada externa a habitacion-service)
        HabitacionDTO h = hClient.obtenerHabitacionPorId(reserva.getHabitacionId());
        
        if (!h.isDisponible()) {
            throw new RuntimeException("La habitación con número " + h.getNumero() + " ya está ocupada.");
        }

        // 3. Persistir la reserva en nuestra DB
        Reserva nueva = repo.save(reserva);

        // 4. Notificar al micro de habitaciones que ahora está OCUPADA
        hClient.actualizarEstado(reserva.getHabitacionId(), false);

        return nueva;
    }

    /**
     * Método Fallback: Se ejecuta si los otros micros están caídos 
     * o si el Circuit Breaker está en estado 'OPEN'.
     */
    public Reserva falloReserva(Reserva r, Throwable t) {
        throw new RuntimeException("No se pudo procesar la reserva. Detalle técnico: " + t.getMessage());
    }

    public List<Reserva> listarTodas() {
        return repo.findAll();
    }
}