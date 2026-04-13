package com.microservicios.reserva_service.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import feign.Response;
import feign.codec.ErrorDecoder;

public class CustomErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        return switch (response.status()) {
            case 400 -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datos inválidos.");
            case 404 -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No encontrado en el otro microservicio.");
            case 500 -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "El microservicio remoto tuvo un error interno (Check DB).");
            case 503 -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Microservicio remoto caído.");
            default -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Fallo de comunicación desconocido.");
        };
    }
}