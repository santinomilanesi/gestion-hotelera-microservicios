package com.microservicios.usuario_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservicios.usuario_service.model.Usuario;
import com.microservicios.usuario_service.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Gestión de Usuarios", description = "API para administración de clientes y personal del hotel")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo usuario", description = "Crea un perfil de usuario con rol (ADMIN/CLIENTE) y DNI.")
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("CLIENTE");
        }
        Usuario nuevoUsuario = service.guardar(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Modifica los datos de un huésped existente sin requerir contraseña.")
    @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id, 
            @RequestBody Usuario datosActualizados) {
        
        // 1 Buscamos el usuario actual en la BD 
        Usuario usuarioExistente = service.buscarPorId(id);
        
        // 2 Actualizamos solo los campos permitidos del perfil
        usuarioExistente.setNombre(datosActualizados.getNombre());
        usuarioExistente.setDni(datosActualizados.getDni());
        usuarioExistente.setEmail(datosActualizados.getEmail());
        usuarioExistente.setTelefono(datosActualizados.getTelefono());
        
        if (datosActualizados.getRol() != null && !datosActualizados.getRol().isEmpty()) {
            usuarioExistente.setRol(datosActualizados.getRol());
        }

        // 3 Guardamos. Como usuarioExistente ya tiene su ID y su PASSWORD original,
        // JPA simplemente hace un UPDATE de los campos que cambiamos.
        Usuario usuarioGuardado = service.guardar(usuarioExistente);
        
        return ResponseEntity.ok(usuarioGuardado);
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar usuario por email")
    public ResponseEntity<Usuario> obtenerPorEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.buscarPorEmail(email));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}