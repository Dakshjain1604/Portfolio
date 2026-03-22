# ⚡ Next.js Developer Portfolio

A high-performance, visually stunning developer portfolio built with **Next.js 15**, **Tailwind CSS**, and modern animation libraries. Designed to showcase projects, skills, and experience with a premium, interactive feel.

## ✨ Features

- **Dynamic Hero Section**: featuring a starry background with shooting stars, a floating draggable video, and a premium "Magic Button" CTA.
- **Interactive 3D Projects**: Project cards that tilt and track mouse movement for a 3D effect.
- **Infinite Skills Marquee**: A continuously scrolling loop of technical skills and icons.
- **Animated Timeline**: A vertical timeline to visualize professional experience with scroll-triggered animations.
- **Floating Dock Navigation**: A glassmorphic header bar that slides into view.
- **Global Polish**: Smooth text generation, spotlight effects, and refined typography.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: 
  - [Framer Motion](https://www.framer.com/motion/)
  - [Aceternity UI](https://ui.aceternity.com/) (Sparkles, 3D Cards, Moving Cards)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open locally:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the site in action.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── components/       # Page-specific sections (Hero, Skills, Projects)
│   ├── layout.tsx        # Root layout with fonts and metadata
│   └── page.tsx          # Main entry point
├── components/
│   └── ui/               # Reusable UI components (Buttons, Cards, Effects)
├── lib/
│   └── utils.ts          # Utility functions (cn class merger)
└── styles/
    └── globals.css       # Global styles and Tailwind directives
```

## 🎨 Customizing

- **Hero Text**: Update `src/app/components/HeroSection.tsx` to change the title and subtext.
- **Projects**: Edit the `projects` array in `src/app/components/ProjectSection.tsx`.
- **Skills**: Modify the `skills` list in `src/app/components/Skills.tsx`.
- **Experience**: Update the timeline data in `src/app/components/Experience.tsx`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
