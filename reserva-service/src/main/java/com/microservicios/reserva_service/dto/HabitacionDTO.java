package com.microservicios.reserva_service.dto;

public class HabitacionDTO {
    private Long id;
    private String numero;
    private boolean disponible;

    public HabitacionDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}