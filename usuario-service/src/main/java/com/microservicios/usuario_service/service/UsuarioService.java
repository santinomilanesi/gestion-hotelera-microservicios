package com.microservicios.usuario_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.microservicios.usuario_service.model.Usuario;
import com.microservicios.usuario_service.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public Usuario guardar(Usuario usuario) {
        return repo.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return repo.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("No se encontró el Usuario con ID: " + id));
    }

    public Usuario buscarPorEmail(String email) {
        return repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No se encontró el Usuario con Email: " + email));
    }

    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. No existe el Usuario con ID: " + id);
        }
        repo.deleteById(id);
    }
}