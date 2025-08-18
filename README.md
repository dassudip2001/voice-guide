# Voice Guide

A modern web application built with Next.js, featuring authentication, responsive design, and a beautiful user interface.

## 🚀 Features

- 🔒 Next.js 14 with App Router
- 🎨 Modern UI with Radix UI components
- 🌓 Light/Dark mode support
- 🔑 Authentication with NextAuth.js
- 🛡️ Secure password hashing with bcryptjs
- 📱 Fully responsive design
- 🎨 Styled with Tailwind CSS
- 📝 Form handling with React Hook Form & Zod validation
- 🗄️ MongoDB integration with Mongoose

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB (with Mongoose ODM)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- MongoDB database (local or Atlas)
- npm, yarn, or bun (bun is used in this project)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voice-guide.git
   cd voice-guide
   ```

2. Install dependencies:
   ```bash
   # Using bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. Set up environment variables:
   - Copy `.example.env` to `.env.local`
   - Update the environment variables in `.env.local`

4. Run the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `dev`: Start the development server
- `build`: Build the application for production
- `start`: Start the production server
- `lint`: Run ESLint

## 📂 Project Structure

```
src/
├── app/               # App router pages
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── models/            # Database models
├── schema/            # Validation schemas
└── types/             # TypeScript type definitions
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
