# Hackathon Hub - Student Risk Assessment System

A comprehensive student risk assessment and management platform built with React, TypeScript, and Supabase. The system uses machine learning algorithms to predict student at-risk status based on attendance, academic performance, assignment completion, and behavior scores.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Features

- 🔐 **Authentication & Authorization** - Role-based access control (Teachers & Students)
- 📊 **Risk Assessment Dashboard** - Real-time monitoring of student performance metrics
- 🤖 **ML-Powered Predictions** - AI-driven risk level predictions using Random Forest algorithm
- 📈 **Analytics & Reporting** - Comprehensive charts and performance trends
- 👥 **Student Management** - Detailed student profiles and tracking
- 💬 **Messaging System** - Communication between teachers and students
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🌙 **Dark Mode Support** - Theme switching capability

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

### Prerequisites

- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase project (get free account at [supabase.com](https://supabase.com))

### Setup Instructions

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd hackathon-hub

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
# Create a .env file in the root directory with:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Step 5: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Chart library

### Backend & Database
- **Supabase** - Backend-as-a-Service (Auth, Database)
- **PostgreSQL** - Database (via Supabase)

### Machine Learning
- **Custom ML Predictor** - Random Forest-based risk prediction algorithm

## Project Structure

```
src/
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── students/       # Student-related components
│   └── ui/             # Reusable UI components (shadcn)
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations (Supabase)
├── lib/                # Utility libraries (ML predictor, utils)
├── pages/              # Page components
└── data/               # Sample data and types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These values can be found in your Supabase project settings under API.

## Deployment

### Via Lovable

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)
3. Make sure to set environment variables in your hosting platform

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
