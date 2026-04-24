CREATE TABLE categories (
    id serial PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    is_default BOOLEAN DEFAULT FALSE
);