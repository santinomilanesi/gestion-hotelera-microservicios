package com.microservicios.reserva_service.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CustomErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == 404) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "El recurso solicitado en el otro servicio no existe.");
        }
        if (response.status() >= 500) {
            return new ResponseStatusException(HttpStatus.BAD_GATEWAY, "El servicio externo no está disponible.");
        }
        return new Exception("Error genérico de comunicación entre microservicios");
    }
}