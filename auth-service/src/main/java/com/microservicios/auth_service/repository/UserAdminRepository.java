package com.microservicios.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.microservicios.auth_service.model.UserAdmin;

@Repository
public interface UserAdminRepository extends JpaRepository<UserAdmin, Long> {
    
    // Spring Data JPA genera la consulta automáticamente por el nombre del método
    Optional<UserAdmin> findByUsername(String username);
}