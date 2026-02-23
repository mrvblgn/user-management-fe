# User Management System

A full-stack user management application built with Next.js 16, TypeScript, PostgreSQL, and Docker.

## 🚀 Features

### Authentication
- JWT-based authentication with httpOnly cookies
- Login/logout functionality
- Protected routes with middleware
- Secure password hashing (bcryptjs)

### User Management
- **Dashboard**: View paginated user list with age filtering
- **Add User**: Create single user with form validation (React Hook Form + Zod)
- **Bulk Upload**: Import users via Excel file with row-level validation
- **User Details**: View individual user information

### Technical Features
- Clean Architecture (Repository → Service → API pattern)
- Transaction support for bulk operations
- Duplicate email detection (both in-file and database)
- Error handling with specific row numbers for Excel uploads
- Type-safe with TypeScript
- Server-side rendering with Next.js App Router
- Responsive UI with TailwindCSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM 6
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod + React Hook Form
- **Styling**: TailwindCSS 4
- **Excel Parsing**: XLSX
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd user-managment-fe
```

### 2. Environment Setup

```bash
cp .env.example .env
```

### 3. Start with Docker

```bash
docker-compose up -d
```

This will:
- Build the Next.js application
- Start PostgreSQL database
- Run migrations automatically
- Seed initial data
- Launch the application on http://localhost:3000

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 5. Login

Use the default admin credentials:
```
Email: admin@example.com
Password: admin
```

## 🧪 Development

### Run locally without Docker

```bash
# Install dependencies
npm install

# Start PostgreSQL (via Docker)
docker-compose up db -d

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

Application will be available at http://localhost:3000

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## 📦 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Check container status
docker-compose ps

# Remove all data (including database)
docker-compose down -v
```

## 📁 Project Structure

```
user-managment-fe/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Login page
│   │   ├── dashboard/           # Dashboard routes
│   │   │   ├── page.tsx        # User list
│   │   │   ├── add/            # Add single user
│   │   │   ├── addMany/        # Excel bulk upload
│   │   │   └── [userId]/       # User detail
│   │   └── api/                 # API routes
│   │       ├── auth/           # Login/Logout
│   │       └── users/          # User CRUD
│   ├── components/              # React components
│   ├── lib/                     # Utilities
│   │   ├── jwt.ts              # JWT token management
│   │   ├── hash.ts             # Password hashing
│   │   └── prisma.ts           # Prisma client
│   ├── repositories/            # Data access layer
│   ├── services/                # Business logic layer
│   ├── types/                   # TypeScript types
│   └── validations/             # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script
│   └── migrations/             # Migration files
├── Dockerfile                   # Docker configuration
├── docker-compose.yml          # Service orchestration
└── middleware.ts               # Route protection
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `POST /api/users` - Create single user
- `POST /api/users/upload` - Bulk upload via Excel

### Health
- `GET /api/health` - Health check endpoint

## 📝 Excel Upload Format

The Excel file should contain the following columns:

| firstName | lastName | email | age | password |
|-----------|----------|-------|-----|----------|
| John | Doe | john@example.com | 30 | pass123 |
| Jane | Smith | jane@example.com | 25 | pass456 |

**Validation Rules:**
- All fields are required
- Email must be valid format
- Age must be a positive integer
- Password minimum 6 characters
- No duplicate emails (within file or database)

**Error Handling:**
- If any row fails validation, no users are added (transaction rollback)
- Error messages include specific row numbers

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcryptjs (10 salt rounds)
- CSRF protection with SameSite cookies
- Middleware-based route protection
- SQL injection prevention (Prisma ORM)
- Input validation on both client and server

## 🎨 UI Features

- Responsive design (mobile-friendly)
- Dark theme with modern aesthetics
- Form validation with real-time feedback
- Loading states and error messages
- Pagination controls
- Age-based filtering

## 🚀 Deployment

The application is production-ready with Docker. For deployment:

1. Update environment variables in `docker-compose.yml`:
   - Set a strong `JWT_SECRET`
   - Configure production `DATABASE_URL`

2. Deploy with Docker:
   ```bash
   docker-compose up -d
   ```

3. (Optional) Use a reverse proxy (nginx/traefik) for HTTPS

## 🧹 Cleanup

To remove all containers and data:

```bash
docker-compose down -v
```

## 📄 License

This project is created as a technical assessment.

## 👤 Author

Merve Bilgin
