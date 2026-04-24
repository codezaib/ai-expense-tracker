CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password VARCHAR(50) NOT NULL 
             CHECK (
                LENGTH(password) >= 6 AND
                password ~ '[!@#$%^&*]' 
             ),
    created_at TIMESTAMP DEFAULT NOW(),
);