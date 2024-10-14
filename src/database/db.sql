
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE Login_user (
    id SERIAL PRIMARY KEY,
    intentos INT NOT NULL,
    bloqueado BOOLEAN NOT NULL,
    fk_user INT NOT NULL,
    foreign key (fk_user) references users(id)
)


INSERT INTO users (name, email, password) 
VALUES ('Manuel', 'manual@gmail.com', 'admin123')	
