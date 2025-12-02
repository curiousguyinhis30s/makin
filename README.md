# Makin - Business Services Platform for Saudi Arabia

A comprehensive business services platform built with Next.js 16, designed to help companies navigate HR, government relations, accounting, and legal compliance in Saudi Arabia.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)

## Features

### Customer Portal
- **Service Requests**: Submit and track HR, Government, Accounting, and Legal service requests
- **Real-time Status**: Monitor request progress with status updates
- **Document Management**: Upload and manage business documents
- **Notifications**: Stay informed about request updates
- **Billing**: View invoices and manage payment methods

### AI-Powered Tools
- **AI Chat**: Get instant answers about Saudi business regulations
- **Resume Builder**: AI-enhanced resume creation and optimization
- **Document Generator**: Generate business documents from templates

### Admin Dashboard
- **User Management**: RBAC-based user and role management
- **Service Management**: CRUD operations for all services
- **Request Processing**: Review, approve, and manage customer requests
- **Analytics**: Business insights and reporting
- **Audit Logs**: Complete activity tracking

### Design System
- **Light/Dark Mode**: Full theme support
- **RTL Support**: Arabic language with RTL layout
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG compliant components

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Database | SQLite + Prisma ORM |
| Auth | NextAuth.js |
| Animation | Framer Motion |
| AI | OpenAI API |
| Icons | Lucide React |
| Charts | Recharts |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/makin.git
cd makin
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:9001"
OPENAI_API_KEY="your-openai-key"
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

The app will be available at [http://localhost:9001](http://localhost:9001)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@makin.sa | Super@123! |
| Admin | admin@makin.sa | Admin@123! |
| Staff | staff@makin.sa | Staff@123! |
| Customer | demo@makin.sa | Demo@123! |

## Project Structure

```
makin/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # Customer portal
│   ├── about/             # About page
│   ├── style-guide/       # Design system documentation
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin-specific components
│   ├── organisms/         # Complex UI components
│   └── ui/                # Base UI components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── i18n.ts            # Internationalization
│   └── translations.ts    # EN/AR translations
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── public/                # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 9001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db seed` | Seed the database |

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `POST /api/register` - User registration

### Requests
- `GET /api/requests` - List user requests
- `POST /api/requests` - Create new request
- `GET /api/requests/[id]` - Get request details
- `PUT /api/requests/[id]` - Update request

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/services` - List all services
- `GET /api/admin/analytics` - Get analytics data

### AI
- `POST /api/ai/chat` - AI chat completions
- `POST /api/ai/resume` - Resume enhancement
- `POST /api/ai/documents` - Document generation

## Database Schema

### Core Models
- **User**: Authentication and profile data
- **Service**: Available business services
- **Request**: Customer service requests
- **Comment**: Request discussions
- **Document**: Uploaded files
- **Invoice**: Billing records
- **Notification**: User notifications

### RBAC Models
- **Role**: User roles (SuperAdmin, Admin, Staff, Customer)
- **Permission**: Granular permissions
- **AuditLog**: Activity tracking

## Design System

Visit `/style-guide` for comprehensive documentation including:
- Color palette with CSS variables
- Typography scale
- Spacing system
- Button variants
- Card components
- Badge styles
- Animation guidelines

### Key CSS Classes

```css
/* Buttons */
.btn-primary    /* Primary CTA button */
.btn-outline    /* Secondary outline button */

/* Cards */
.glass-panel           /* Frosted glass effect */
.nano-border-gradient  /* Animated gradient border */

/* Layout */
.max-w-7xl mx-auto px-6 lg:px-8  /* Container */
```

## Internationalization

The platform supports English and Arabic with RTL layout:

```typescript
import { useLanguage } from "@/lib/i18n";

const { t, direction, language, setLanguage } = useLanguage();

// Usage
<h1>{t("hero.title")}</h1>
<div dir={direction}>...</div>
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma database connection | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `RESEND_API_KEY` | Email service API key | No |
| `UPSTASH_REDIS_URL` | Rate limiting Redis URL | No |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@makin.sa or visit our [Contact Page](https://makin.sa/contact).

---

Built with care for businesses thriving in Saudi Arabia.
