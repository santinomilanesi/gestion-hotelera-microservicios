package com.microservicios.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.microservicios.auth_service.dto.AuthDto;
import com.microservicios.auth_service.dto.TokenDto;
import com.microservicios.auth_service.model.UserAdmin;
import com.microservicios.auth_service.repository.UserAdminRepository;
import com.microservicios.auth_service.security.JwtProvider;

@Service
public class AuthService {

    @Autowired
    private UserAdminRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    public TokenDto login(AuthDto dto) {
        // 1. Buscamos al usuario en la base de datos
        UserAdmin user = repository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Comparamos la contraseña enviada con el hash de la DB
        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            // 3. Si es correcta, generamos el JWT
            String token = jwtProvider.createToken(user.getUsername());
            return new TokenDto(token);
        } 
        
        // 4. Si no coincide, lanzamos la excepción directamente
        throw new RuntimeException("Contraseña incorrecta");
    }
}