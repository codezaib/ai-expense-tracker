CREATE TABLE alerts (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL CHECK (type IN ('unusual', 'near_limit', 'exceeded')),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);