# ⚒️ DreamForge DTL

> **Architect your career with AI-driven insights. Visualize your path, clear your gaps, and accelerate your growth.**

DreamForge is a premium, next-generation Career Growth & Visualization Platform designed to help professionals (Pioneers) navigate the complex landscape of technical and management career tracks.

![Project Banner](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Core Pillars

### 🚀 **Growth Hub (Dashboard)**
The nerve center of your professional evolution.
- **Match Score**: Real-time alignment percentage with your target role.
- **Gamified Progression**: Earn XP, level up, and maintain streaks through daily check-ins.
- **Gap Analysis**: Actionable, prescriptive list of skills needed to reach your next milestone.

### 🌌 **Skill Orb Constellation**
A futuristic, interactive visualization of your technical depth.
- **Dynamic Skill Trees**: Zoom, pan, and explore your competencies as a glowing orb network.
- **Course Recommendations**: Every skill node now suggests premium courses to help you level up.
- **Automatic Ingestion**: Upload your resume, and Sage AI will automatically map your skills into the constellation.

### 💼 **Opportunity Forge (Job Matching)**
The ultimate job recommendation engine.
- **AI-Matched Roles**: Discover roles specifically curated for your unique skill constellation.
- **Architecture Alignment**: See exactly which gaps are preventing you from reaching a 100% match.
- **Market Value Insights**: Real-time salary analysis for your projected growth.

### 🧪 **Architecture Lab**
Experimental simulators for long-term career planning.
- **What-If Simulator**: Project your salary and level 10 years into the future based on specialization choices.
- **Career Branching**: (Coming Soon) Compare IC vs. Management tracks side-by-side.

### 🤖 **Sage AI Coach**
Your personal career architect powered by Llama 3.3.
- **Context-Aware Advice**: Sage knows your level and match score, providing tailored guidance.
- **Deep Insights**: From resume optimization to interview strategies.

### 🚇 **Career Metro Map**
Visualize your professional trajectory like a subway navigation system.
- **Track Switching**: Seamlessly transition between Technical and Management lines.
- **"You Are Here"**: Animated indicators showing your current station and the stops ahead.

### 🤖 **Sage AI Coach**
Your personal career architect powered by Llama 3.3.
- **Context-Aware Advice**: Sage knows your level and match score, providing tailored guidance.
- **Deep Insights**: From resume optimization to interview strategies.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Neon Postgres](https://neon.tech/) (Serverless)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Auth.js v5](https://authjs.dev/) (NextAuth)
- **AI**: [Groq SDK](https://groq.com/) (Llama 3.3-70B)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Neon Database account
- A Groq API key

### 2. Installation
```bash
git clone https://github.com/your-repo/dreamforge.git
cd dreamforge
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```

### 4. Database Setup
Push the schema to your Neon DB:
```bash
npx drizzle-kit push
```

### 5. Launch
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the forge in action.

---

## 📂 Project Structure

```text
dreamforge/
├── app/                  # Next.js App Router (Pages & API)
│   ├── (auth)/           # Authentication Routes
│   ├── (dashboard)/      # Core Platform Features
│   └── api/              # AI and Registry Endpoints
├── components/           
│   ├── ui/               # Primary UI Primitives
│   ├── layout/           # Sidebar & Navigation
│   └── features/         # Specialized Feature Logic
├── lib/                  # Database, Auth, and Shared Utilities
└── public/               # Static Assets & Grids
```

---

## 📜 License
Built with ❤️ by the DreamForge Team.
