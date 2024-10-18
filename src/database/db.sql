
CREATE DATABASE SISTEMA_CONTABLE;

USE SISTEMA_CONTABLE;

-- Crear la tabla 'users'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(15) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    primer_ingreso BOOLEAN DEFAULT TRUE,
    preg_contestadas INT NOT NULL DEFAULT 0, -- cantidad de preguntas contestadas correctamente
    ult_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bloqueado BOOLEAN NOT NULL DEFAULT FALSE, -- estado
    intentos INT NOT NULL DEFAULT 0, -- intentos de inicio de sesión
    -- Campos de auditoría
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);


-- Crear la tabla 'roles'
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    -- campos de auditoria
    -- Campos de auditoría
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- Crear la tabla 'users_roles'
CREATE TABLE users_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_user INT NOT NULL,
    fk_role INT NOT NULL,
    -- Campos de auditoría
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user) REFERENCES users(id),
    FOREIGN KEY (fk_role) REFERENCES roles(id),
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);


-- crear la tabla de preguntas
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    fk_user INT NOT NULL,
    -- campos de auditoria
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user) REFERENCES users(id),
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- crear la tabla de parametros
CREATE TABLE parametros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- nombre del parametro
    valor VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    -- campos de auditoria
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- crear la tabla de historial de contraseñas
CREATE TABLE historial_contrasenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_user INT NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    -- campos de auditoria
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user) REFERENCES users(id),
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- crear tabla para los objetos (tablas)
CREATE TABLE objetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    -- campos de auditoria
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- crear la tabla de permisos
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tabla INT NOT NULL,
    insercion BOOLEAN NOT NULL,
    modificacion BOOLEAN NOT NULL,
    eliminacion BOOLEAN NOT NULL,
    consulta BOOLEAN NOT NULL,
    -- campos de auditoria
    fk_created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_created_by) REFERENCES users(id),
    FOREIGN KEY (fk_modified_by) REFERENCES users(id)
);

-- Relación entre roles y permisos
CREATE TABLE roles_permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_role INT NOT NULL,
    fk_permiso INT NOT NULL,
    FOREIGN KEY (fk_role) REFERENCES roles(id),
    FOREIGN KEY (fk_permiso) REFERENCES permisos(id)
);

CREATE TABLE auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entidad VARCHAR(50) NOT NULL, -- Nombre de la tabla afectada
    accion VARCHAR(50) NOT NULL, -- Tipo de acción (INSERT, UPDATE, DELETE)
    id_registro INT NOT NULL, -- ID del registro afectado
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_user INT NOT NULL, -- Usuario que hizo el cambio
    FOREIGN KEY (fk_user) REFERENCES users(id)
);


CREATE INDEX idx_fk_user ON users_roles(fk_user);
CREATE INDEX idx_fk_role ON users_roles(fk_role);


