# Local Database Setup

## Option A: Homebrew MySQL (current local dev method)

```bash
brew install mysql
brew services start mysql

mysql -u root -e "
  CREATE DATABASE IF NOT EXISTS personal_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'personal_user'@'localhost' IDENTIFIED BY '[REDACTED]';
  GRANT ALL PRIVILEGES ON personal_website.* TO 'personal_user'@'localhost';
  FLUSH PRIVILEGES;
"
```

## Option B: Docker Compose (requires Docker/Colima)

```bash
cd infra/local-db
docker compose up -d
```

Both approaches use the same credentials matching `apps/backend-api/.env`.

## Credentials

| Key | Value |
|-----|-------|
| Database | personal_website |
| User | personal_user |
| Password | [REDACTED] |
| Host | localhost |
| Port | 3306 |
