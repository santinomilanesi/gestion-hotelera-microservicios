package com.microservicios.habitacion_service.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservicios.habitacion_service.exception.ResourceNotFoundException;
import com.microservicios.habitacion_service.model.Habitacion;
import com.microservicios.habitacion_service.repository.HabitacionRepository;

@Service
public class HabitacionService {

    private final HabitacionRepository repo;

    public HabitacionService(HabitacionRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Habitacion guardar(Habitacion h) {
        return repo.save(h);
    }

    @Transactional(readOnly = true)
    public List<Habitacion> listarTodas() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public List<Habitacion> listarDisponibles() {
        return repo.findByDisponibleTrue();
    }

    @Transactional(readOnly = true)
    public Habitacion buscarPorId(Long id) {
        System.out.println("Buscando habitación con ID: " + id);
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Habitación con ID " + id + " no encontrada."));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró la habitación para eliminar.");
        }
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("No se puede eliminar la habitación porque tiene reservas asociadas.");
        }
    }

    @Transactional
    public void actualizarDisponibilidad(Long id, boolean disponible) {
        Habitacion hab = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se puede actualizar: ID " + id + " no existe."));
        
        System.out.println("Cambiando disponibilidad de Habitación " + hab.getNumero() + " a: " + disponible);
        
        hab.setDisponible(disponible);
        repo.save(hab);
    }
}