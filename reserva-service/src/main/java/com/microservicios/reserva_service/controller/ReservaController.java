package com.microservicios.reserva_service.controller;

import com.microservicios.reserva_service.model.Reserva;
import com.microservicios.reserva_service.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {
    private final ReservaService service;

    public ReservaController(ReservaService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Reserva> crear(@Valid @RequestBody Reserva r) {
        return new ResponseEntity<>(service.crearReserva(r), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }
}