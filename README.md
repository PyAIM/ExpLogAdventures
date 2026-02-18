# Exponential & Logarithmic Adventures

A gamified learning environment designed to help precalculus students master exponential and logarithmic functions through interactive challenges and real-world applications.

## 🎮 Activities

### 1. **Exponential Explorer**
Master the basics of exponential functions through interactive graph manipulation.
- Adjust parameters `a` and `b` in `f(x) = a·b^x`
- Complete 5 progressive challenges
- Learn about growth vs. decay, y-intercepts, and asymptotes
- Visual feedback with real-time graphing

### 2. **Log Detective**
Crack the code by converting between exponential and logarithmic forms.
- Timed matching game with 3 difficulty levels
- Match exponential forms (e.g., `2³ = 8`) with logarithmic equivalents (e.g., `log₂(8) = 3`)
- Earn bonus points for speed
- Progressive difficulty with more complex problems

### 3. **Compound Interest Quest**
Build your fortune by mastering exponential growth in real-world savings scenarios.
- Choose savings goals (gaming console, laptop, car, college fund)
- Adjust principal, interest rate, and time period
- Compare different compounding frequencies (annually, quarterly, monthly, continuous)
- Visual charts showing growth over time
- Learn the formulas: `A = P(1 + r/n)^(nt)` and `A = Pe^(rt)`

### 4. **Viral Video Challenge**
Predict how fast content spreads using exponential growth models.
- Multiple scenarios: dance challenges, breaking news, cute animals, celebrity drama
- Predict view counts using the formula `V(t) = V₀ · r^t`
- Score based on prediction accuracy
- Visualize exponential growth curves
- Understand how small changes in growth rate create massive differences

### 5. **Carbon Dating Lab**
Uncover ancient secrets using exponential decay and half-life calculations.
- Analyze 5 different artifacts (pottery, tools, bones, cave paintings, fossils)
- Calculate age from remaining Carbon-14 percentage
- Use the decay formula: `N(t) = N₀ × (1/2)^(t/t_half)`
- Solve for age: `t = [ln(N/N₀) / ln(0.5)] × t_half`
- Discover artifacts and earn achievement points

## 🎨 Design Philosophy

The application uses a **Neo-Brutalist meets Educational Playfulness** design approach:

- **Bold geometry** with thick borders and strong contrast
- **Vibrant color blocks** where each activity has its own signature color
- **Tactile, game-like interactions** that feel physical and immediate
- **Spring-based animations** for satisfying feedback
- **Typography**: Space Grotesk for headings, Inter for body text, JetBrains Mono for mathematical expressions

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Deployment to GitHub Pages

This application is designed to be deployed as a static site on GitHub Pages:

1. Build the project:
   ```bash
   pnpm build
   ```

2. The build output will be in the `dist/public` directory

3. Deploy to GitHub Pages:
   - Push the `dist/public` folder to the `gh-pages` branch
   - Or use GitHub Actions for automated deployment

## 📚 Learning Objectives

Students will:

1. **Understand exponential functions** (`f(x) = a·b^x`)
   - Identify growth vs. decay based on base value
   - Recognize the role of parameters `a` and `b`
   - Understand asymptotic behavior

2. **Master logarithmic functions**
   - Convert between exponential and logarithmic forms
   - Understand the inverse relationship
   - Apply logarithmic properties

3. **Apply exponential models** to real-world scenarios
   - Compound interest calculations
   - Population/viral growth modeling
   - Radioactive decay and carbon dating

4. **Develop mathematical intuition**
   - Estimate exponential growth/decay
   - Recognize exponential patterns
   - Make predictions using mathematical models

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with custom design tokens
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing
- **shadcn/ui** - Component library
- **Vite** - Build tool

## 📖 Course Alignment

This application is designed to complement MAT1580 Chapter 6 content, covering:

- Exponential functions and their properties
- Logarithmic functions and their properties
- Exponential and logarithmic equations
- Applications of exponential and logarithmic functions
- Compound interest formulas
- Exponential growth and decay models

## 🎯 Pedagogical Approach

The gamification strategy addresses common student challenges:

1. **Abstract concepts made concrete** - Visual, interactive representations
2. **Immediate feedback** - Students see results of their actions instantly
3. **Progressive difficulty** - Scaffolded learning from basic to advanced
4. **Real-world relevance** - Applications to finance, social media, archaeology
5. **Intrinsic motivation** - Points, achievements, and challenges
6. **Low-stakes practice** - Safe environment to experiment and learn from mistakes

## 📝 License

MIT License - Feel free to use and adapt for educational purposes.

## 🙏 Acknowledgments

Designed for precalculus students who struggle with abstract mathematics and traditional lecture approaches. This gamified environment aims to make learning exponential and logarithmic functions engaging, interactive, and fun!
