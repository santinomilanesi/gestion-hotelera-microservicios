package com.microservicios.habitacion_service.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.microservicios.habitacion_service.model.Habitacion;
import com.microservicios.habitacion_service.repository.HabitacionRepository;

@Service
public class HabitacionService {

    private final HabitacionRepository repo;

    public HabitacionService(HabitacionRepository repo) {
        this.repo = repo;
    }

    public Habitacion guardar(Habitacion h) {
        return repo.save(h);
    }

    public List<Habitacion> listarTodas() {
        return repo.findAll();
    }

    public List<Habitacion> listarDisponibles() {
        return repo.findByDisponibleTrue();
    }

    public Habitacion buscarPorId(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("No se encontró la Habitación con ID: " + id));
    }

    @Transactional
    public void actualizarDisponibilidad(Long id, boolean disponible) {
        Habitacion hab = buscarPorId(id);
        hab.setDisponible(disponible);
        repo.save(hab);
    }
}