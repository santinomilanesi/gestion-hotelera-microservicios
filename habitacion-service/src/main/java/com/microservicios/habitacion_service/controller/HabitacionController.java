package com.microservicios.habitacion_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.microservicios.habitacion_service.model.Habitacion;
import com.microservicios.habitacion_service.service.HabitacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/habitaciones")
@Tag(name = "Inventario de Habitaciones")
public class HabitacionController {

    private final HabitacionService service;

    public HabitacionController(HabitacionService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Registrar nueva habitación")
    public ResponseEntity<Habitacion> crear(@Valid @RequestBody Habitacion h) {
        return new ResponseEntity<>(service.guardar(h), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Habitacion>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Habitacion>> listarDisponibles() {
        return ResponseEntity.ok(service.listarDisponibles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}/disponibilidad")
    @Operation(summary = "Cambiar disponibilidad", description = "Este endpoint será usado por el servicio de Reservas")
    public ResponseEntity<Void> actualizarEstado(@PathVariable Long id, @RequestParam boolean disponible) {
        service.actualizarDisponibilidad(id, disponible);
        return ResponseEntity.noContent().build();
    }
}