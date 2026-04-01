package com.microservicios.reserva_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private final LocalDateTime timestamp;
    private final int estado;
    private final String error;
    private final String mensaje;
    private final String detalles;

    public ErrorResponse(int estado, String error, String mensaje, String detalles) {
        this.timestamp = LocalDateTime.now();
        this.estado = estado;
        this.error = error;
        this.mensaje = mensaje;
        this.detalles = detalles;
    }

    // Getters (Importantes para que Jackson pueda armar el JSON de respuesta)
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getEstado() {
        return estado;
    }

    public String getError() {
        return error;
    }

    public String getMensaje() {
        return mensaje;
    }

    public String getDetalles() {
        return detalles;
    }
}