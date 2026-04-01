package com.microservicios.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservicios.auth_service.repository.UserAdminRepository;

@RestController
@RequestMapping("/auth")
public class TestController {

    @Autowired
    private UserAdminRepository userAdminRepository; // Inyectamos el repo

    @GetMapping("/check")
    public String check() {
        try {
            long cantidad = userAdminRepository.count(); // Intentamos tocar la DB
            return "CONEXIÓN EXITOSA: La tabla existe y hay " + cantidad + " usuarios.";
        } catch (Exception e) {
            return "ERROR DE BASE DE DATOS: " + e.getMessage();
        }
    }
}