package com.microservicios.habitacion_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class HabitacionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(HabitacionServiceApplication.class, args);
	}

}
