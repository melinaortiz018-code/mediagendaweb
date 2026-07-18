
-- 1. Tabla de Roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nombre) VALUES ('Admin'), ('Medico'), ('Paciente');

-- 2. Tabla de Usuarios (Registro y Login Seguro)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- 3. Tabla de Especialidades Médicas
CREATE TABLE especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO especialidades (nombre) VALUES ('Medicina General'), ('Pediatría'), ('Cardiología'), ('Dermatología');

-- 4. Tabla de Médicos (Detalle adicional para vincular a especialidad)
CREATE TABLE medicos_detalle (
    usuario_id INT PRIMARY KEY,
    especialidad_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- 5. Gestión de Horarios de Trabajo (Agenda Médica por el Admin)
CREATE TABLE horarios_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medico_id INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    FOREIGN KEY (medico_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 6. Tabla de Citas Médicas y sus Estados
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('En espera', 'En consulta', 'Atendido', 'No asistió', 'Cancelado') DEFAULT 'En espera',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 7. Historial Clínico Básico (Panel del Paciente)
CREATE TABLE historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha DATE NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
