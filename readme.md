# AI Expense Tracker 
A full-stack expense tracking web app with AI-powered natural language expense entry, budget management, and smart alerts.

## Features
- **Authentication** — Register/login with JWT-based auth
- **Expense Management** — Add, edit, delete, and filter expenses by date/category
- **Category Management** — Predefined + custom categories
- **Budget Management** — Set monthly and per-category budgets with usage tracking
- **Smart Alerts** — Notifications when near/over budget or unusual spending detected, email notifications
- **AI Assistant** — Type expenses naturally (e.g. *"I spent 500 on food today"*) and the system extracts and saves them automatically
- **Dynamic AI Config** — Choose your own model, API key, and system prompt from the UI

---

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | JWT (JSON Web Tokens) |
| AI | LangChain + LangGraph |
| Email | Nodemailer (SMTP) |

---

## ⚙️ Prerequisites

- Node.js v18+
- PostgreSQL 14+ (local or hosted via [Neon](https://neon.tech))
- npm or yarn

---

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/codezaib/ai-expense-tracker.git
cd ai-expense-tracker
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (e.g. `5000`) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_LIFETIME` | Token expiry (e.g. `1d`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `DEFAULT_AI_API_KEY` | Your OpenRouter / OpenAI API key |
| `DEFAULT_AI_MODEL` | Default model (e.g. `deepseek/deepseek-v3-2`) |
| `DEFAULT_AI_INTEGRATION` | AI integration type (e.g. `ChatOpenAI`) |
| `FRONTEND_URL` | Frontend origin for CORS |
| `SMTP_USER` | Gmail address for sending alerts |
| `SMTP_PASS` | Gmail App Password |

---

## Database Setup

### Tables & Schema

```sql
-- Users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) UNIQUE NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  amount      DECIMAL(10, 2) NOT NULL,
  note        TEXT,
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  amount      DECIMAL(10, 2) NOT NULL,
  month       INT DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
  year        INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

> These are for reference only. Prisma manages the actual schema via `src/prisma/schema.prisma`.

---

### Option A — Local PostgreSQL + Prisma

1. Install PostgreSQL and create the database:
    CREATE DATABASE expensetracker;
2. Pull local DB to prisma:
    npx prisma db pull
3. generate prisma client:
    npx prisma generate

### Option B — Prisma Postgres (Online)

1. Go to [prisma.io/postgres](https://prisma.io/postgres) and create a free project
2. Copy the connection string from the dashboard
3. Set it in `.env`: