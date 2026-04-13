package com.microservicios.habitacion_service.exception;

import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.microservicios.habitacion_service.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex, WebRequest request) {
        String errores = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(" | "));

        return new ResponseEntity<>(new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), "Error de Validación", errores, request.getDescription(false)
        ), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> manejarNotFound(ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(new ErrorResponse(
            HttpStatus.NOT_FOUND.value(), "No Encontrado", ex.getMessage(), request.getDescription(false)
        ), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> manejarIntegridad(DataIntegrityViolationException ex, WebRequest request) {
        return new ResponseEntity<>(new ErrorResponse(
            HttpStatus.CONFLICT.value(), 
            "Conflicto de Integridad", 
            "No se puede realizar la operación: el registro tiene dependencias activas (ej. reservas).", 
            request.getDescription(false)
        ), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> manejarEstadoIlegal(IllegalStateException ex, WebRequest request) {
        return new ResponseEntity<>(new ErrorResponse(
            HttpStatus.CONFLICT.value(), 
            "Conflicto de Estado", 
            ex.getMessage(), 
            request.getDescription(false)
        ), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarGlobal(Exception ex, WebRequest request) {
        return new ResponseEntity<>(new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error del Servidor", ex.getMessage(), request.getDescription(false)
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}