package com.microservicios.reserva_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.microservicios.reserva_service.dto.HabitacionDTO;

@FeignClient(name = "habitacion-service")
public interface HabitacionFeignClient {
    @GetMapping("/habitaciones/{id}")
    HabitacionDTO obtenerHabitacionPorId(@PathVariable("id") Long id);

    @PutMapping("/habitaciones/{id}/disponibilidad")
    void actualizarEstado(@PathVariable("id") Long id, @RequestParam("disponible") boolean disponible);
}