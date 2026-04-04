package com.microservicios.auth_service.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    // Extraemos la clave de la propiedad definida en el yml o variable de entorno
    @Value("${app.security.jwt.secret}")
    private String secret;

    public String createToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + 3600000); // 1 hora de validez

        // Usamos StandardCharsets para asegurar compatibilidad total
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        Key key = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}