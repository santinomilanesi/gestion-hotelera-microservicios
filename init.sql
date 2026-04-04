-- Crear las bases de datos necesarias
CREATE DATABASE usuarios_db;
CREATE DATABASE habitaciones_db;
CREATE DATABASE reservas_db;

-- Nos conectamos a auth_db (que ya existe por el compose) para crear la tabla y el usuario inicial
\c auth_db;

CREATE TABLE IF NOT EXISTS user_admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insertamos el admin con la clave '123456' encriptada (BCrypt)
INSERT INTO user_admin (username, email, password) 
VALUES ('admin', 'admin@hotel.com', '$2a$10$vI8ZWBZ.T6lMvxT.A8r.TuTAnC8QYm9xN2f4S1nC.mC8oYqV6fO1C')
ON CONFLICT (username) DO NOTHING;