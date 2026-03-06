# Portfolio v2

A full-stack web application built with **ASP.NET Core 10** and **Angular 21**, featuring a complete authentication system with email confirmation, two-factor authentication, and account management.

## Features

- **Authentication** — Register, login, logout with cookie-based JWT tokens
- **Email Confirmation** — Email verification flow with queued background email sending
- **Two-Factor Authentication** — TOTP authenticator app support with recovery codes
- **Account Management** — Profile editing, password change/reset, email change, personal data export/deletion
- **CSRF Protection** — Antiforgery token support for secure form submissions
- **Background Email Service** — Queued email delivery with retry logic via SMTP
- **Responsive UI** — Angular frontend styled with Tailwind CSS v4
- **Dark Mode** — Theme switching support

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Backend   | ASP.NET Core 10, Entity Framework Core  |
| Frontend  | Angular 21, Tailwind CSS 4              |
| Database  | PostgreSQL                              |
| Auth      | ASP.NET Identity, JWT, Cookie auth      |
| Email     | SMTP with background queue              |
| Testing   | Vitest                                  |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v20+)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/aspnet-angular-dashboard.git
cd aspnet-angular-dashboard
```

### 2. Set up the backend

```bash
cd BackendApp

# Copy the example environment file and fill in your values
cp .env.example .env

# Restore dependencies
dotnet restore

# Apply database migrations
dotnet ef database update

# Run the backend
dotnet run
```

The API will be available at `https://localhost:7286`.

### 3. Set up the frontend

```bash
cd ClientApp

# Install dependencies
npm install

# Start the development server
ng serve
```

The app will be available at `http://localhost:4200`.

## Configuration

All configuration is managed through environment variables. Copy `BackendApp/.env.example` to `BackendApp/.env` and set the required values:

| Variable                  | Description                          |
| ------------------------- | ------------------------------------ |
| `DB__Host`                | PostgreSQL host                      |
| `DB__Port`                | PostgreSQL port (default: 5432)      |
| `DB__Name`                | Database name                        |
| `DB__Username`            | Database username                    |
| `DB__Password`            | Database password                    |
| `Jwt__Key`                | JWT signing key (min 32 characters)  |
| `Jwt__Issuer`             | JWT issuer                           |
| `Jwt__Audience`           | JWT audience                         |
| `Jwt__ExpirationInMinutes`| Token expiration in minutes          |
| `Smtp__Host`              | SMTP server host                     |
| `Smtp__Port`              | SMTP server port                     |
| `Smtp__Username`          | SMTP username                        |
| `Smtp__Password`          | SMTP password                        |
| `Smtp__FromEmail`         | Sender email address                 |
| `Smtp__FromName`          | Sender display name                  |
| `Smtp__EnableSsl`         | Enable SSL for SMTP (true/false)     |
| `AppUrl`                  | Frontend application URL             |

## Project Structure

```
├── BackendApp/              # ASP.NET Core API
│   ├── Controllers/         # API endpoints (Auth, Account)
│   ├── Data/                # EF Core DbContext and entities
│   ├── Migrations/          # Database migrations
│   ├── Models/              # Request/response DTOs
│   ├── Services/            # Email queue, templates, background services
│   ├── Properties/          # Launch settings
│   ├── Dockerfile
│   └── Program.cs           # Application entry point
│
├── ClientApp/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── config/      # App configuration
│   │   │   ├── guards/      # Route guards
│   │   │   ├── layout/      # Layout components (sidebar, navbar, topbar)
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── pages/       # Page components
│   │   │   └── services/    # HTTP services, interceptors
│   │   └── environments/    # Environment configs
│   └── public/              # Static assets
│
├── LICENSE
└── README.md
```

## Docker

```bash
cd BackendApp
docker build -t aspnet-angular-dashboard .
docker run -p 8080:8080 --env-file .env aspnet-angular-dashboard
```

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the [AGPL-3.0 license](LICENSE).
