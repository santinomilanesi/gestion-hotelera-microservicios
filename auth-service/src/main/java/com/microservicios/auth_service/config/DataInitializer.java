package com.microservicios.auth_service.config;

import com.microservicios.auth_service.model.UserAdmin;
import com.microservicios.auth_service.repository.UserAdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserAdminRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Buscamos si ya existe el admin para no duplicarlo cada vez que reiniciás
            UserAdmin admin = repository.findByUsername("admin")
                    .orElse(new UserAdmin());

            admin.setUsername("admin");
            admin.setEmail("admin@hotel.com");
            
            // Seteamos la clave '123456' usando el encriptador oficial
            // Esto asegura que el hash en la DB sea 100% compatible con el login
            admin.setPassword(passwordEncoder.encode("123456"));
            
            repository.save(admin);
            
            System.out.println("✅ [SISTEMA] Base de datos sincronizada: usuario 'admin' listo con clave '123456'.");
        };
    }
}