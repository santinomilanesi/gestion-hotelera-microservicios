package com.microservicios.habitacion_service.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.microservicios.habitacion_service.model.Habitacion;
import com.microservicios.habitacion_service.service.HabitacionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/habitaciones")
public class HabitacionController {

    private final HabitacionService service;

    public HabitacionController(HabitacionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Habitacion> crear(@Valid @RequestBody Habitacion h) {
        return new ResponseEntity<>(service.guardar(h), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habitacion> actualizar(@PathVariable Long id, @RequestBody Habitacion datos) {
        Habitacion habExistente = service.buscarPorId(id);
        if (datos.getNumero() != null) habExistente.setNumero(datos.getNumero());
        if (datos.getTipo() != null) habExistente.setTipo(datos.getTipo());
        if (datos.getPrecio() != null) habExistente.setPrecio(datos.getPrecio());
        habExistente.setDisponible(datos.isDisponible());
        return ResponseEntity.ok(service.guardar(habExistente));
    }

    @GetMapping
    public ResponseEntity<List<Habitacion>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<Void> actualizarEstado(
            @PathVariable Long id, 
            @RequestBody Habitacion datos) { 
        
        System.out.println("DEBUG: Recibida petición de cambio de estado para habitación ID: " + id);
        service.actualizarDisponibilidad(id, datos.isDisponible());
        return ResponseEntity.noContent().build();
    }
}