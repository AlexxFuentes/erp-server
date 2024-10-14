
CREATE DATABASE SISTEMA_CONTABLE;

USE SISTEMA_CONTABLE;

-- Crear la tabla 'users'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla 'login_user'
CREATE TABLE login_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intentos INT NOT NULL,
    bloqueado BOOLEAN NOT NULL,
    fk_user INT NOT NULL,
    FOREIGN KEY (fk_user) REFERENCES users(id)
);


INSERT INTO users (name, email, password) 
VALUES ('Manuel', 'manual@gmail.com', 'admin123')	
