# SeeraCV - سيرتي

A professional Arabic CV builder with AI-powered content enhancement and modern templates.

## 🎯 About

SeeraCV (سيرتي) is a full-stack web application designed to help Arabic-speaking job seekers create professional CVs quickly and efficiently. The platform features AI-powered content suggestions, multiple modern templates, and seamless PDF export.

**Author:** Mohamed Khalifa  
**Version:** 1.0.0  
**License:** MIT

## ✨ Features

- 🤖 **AI-Powered Content** - Intelligent suggestions for summaries, experience descriptions, and skills using Google Gemini AI
- 📄 **Multiple Templates** - Professional, Classic, Minimal, and Orange templates optimized for Arabic content
- 💳 **Subscription Plans** - Basic and Professional tiers with Stripe payment integration
- 🌐 **Arabic-First** - Full RTL (Right-to-Left) support with Arabic interface
- 📱 **Responsive Design** - Mobile-friendly interface using modern CSS
- 🔐 **Secure Authentication** - User accounts with email verification
- 💾 **Auto-Save Drafts** - Never lose your work with automatic draft saving
- 📥 **PDF Export** - High-quality PDF downloads with print-optimized layouts

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **TanStack Query** - Server state management

### Backend & Services
- **Supabase** - Authentication, database, and edge functions
- **PostgreSQL** - Relational database
- **Stripe** - Payment processing
- **Google Gemini API** - AI content generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)
- Google AI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd seera-cv
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run database migrations:
```bash
npx supabase db push
```

5. Start development server:
```bash
npm run dev
```

The app will be available at `https://seeracv.com`

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `cv_drafts` - Saved CV drafts
- `payments` - Subscription and payment tracking
- `plans` - Available subscription plans

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

**Server-Side (Supabase Secrets):**
- `STRIPE_SECRET_KEY` - Stripe secret key
- `GEMINI_API_KEY` - Google Gemini API key

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Mohamed Khalifa**  
Full-Stack Developer specializing in React, TypeScript, and modern web applications.

---

Built with ❤️ for the Arabic-speaking community

