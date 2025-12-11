# AI Job Assistant - Frontend Application

A modern, premium-quality frontend application for an AI-powered job assistance platform built with Next.js, TypeScript, and Tailwind CSS.

##  Features

### 1. **AI Resume Checker** (`/resume-checker`)
- Upload PDF resumes
- ATS compatibility score (0-100)
- Detailed strengths analysis
- Actionable improvement suggestions
- Missing skills recommendations

### 2. **Smart Job Search** (`/job-suggestions`)
- AI-powered job matching
- Country and experience level filters
- Personalized job recommendations
- Match reasoning for each position

### 3. **Interview Scheduler** (`/interview-scheduler`)
- Schedule AI-powered interviews
- Auto-generated interview questions
- Support for Technical, Behavioral, and Mock interviews
- Shareable interview links

### 4. **Interview Entry Page** (`/interview/[id]`)
- Dynamic interview session page
- Candidate information collection
- Pre-interview checklist
- Ready for Vapi integration

### 5. **Course Recommendations** (`/courses`)
- Resume-based or goal-based analysis
- Personalized learning paths
- Course difficulty levels
- Platform and duration details

### 6. **Salary Estimator** (`/salary-estimator`)
- AI-driven salary insights
- Salary range calculations
- Market trend analysis
- Country and experience-based estimates

##  Design System



### Components
All components are reusable and follow a consistent design system:
- `Navbar` - Responsive navigation with mobile menu
- `Footer` - Comprehensive footer with links
- `Button` - 3 variants (primary, secondary, outline)
- `Card` - Modern card with hover effects
- `Input` - Form input with label and error states
- `Select` - Dropdown with label support
- `Textarea` - Multi-line text input
- `FileUpload` - Drag-and-drop file upload
- `JobCard` - Job listing display
- `ATSScoreCard` - Resume analysis results
- `GeneratedLinkBox` - Interview link and questions
- `SkeletonLoader` - Loading state component
- `SectionTitle` - Consistent page headings

## 📁 Project Structure

```
ai-job-assistant/
├── app/
│   ├── courses/
│   │   └── page.tsx
│   ├── interview/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── interview-scheduler/
│   │   └── page.tsx
│   ├── job-suggestions/
│   │   └── page.tsx
│   ├── resume-checker/
│   │   └── page.tsx
│   ├── salary-estimator/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Landing Page)
├── components/
│   ├── ATSScoreCard.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── FileUpload.tsx
│   ├── Footer.tsx
│   ├── GeneratedLinkBox.tsx
│   ├── Input.tsx
│   ├── JobCard.tsx
│   ├── Navbar.tsx
│   ├── Select.tsx
│   ├── SectionTitle.tsx
│   ├── SkeletonLoader.tsx
│   └── Textarea.tsx
└── public/
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)
- **Icons**: SVG (inline)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to project directory:
```bash
cd ai-job-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📄 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and testimonials |
| `/resume-checker` | Upload and analyze resumes for ATS compatibility |
| `/job-suggestions` | AI-powered job search and matching |
| `/interview-scheduler` | Schedule AI interviews with auto-generated questions |
| `/interview/[id]` | Dynamic interview entry page for candidates |
| `/courses` | Personalized course recommendations |
| `/salary-estimator` | Salary estimation tool |

##  Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Hamburger menu for mobile

### Modern UI/UX
- Smooth animations and transitions
- Hover effects on interactive elements
- Gradient backgrounds and text
- Glassmorphism effects
- Loading states with skeleton loaders

### Mock Data
All features include realistic mock data for demonstration:
- ATS scores and feedback
- Job listings with match reasons
- Interview questions for different types
- Course recommendations
- Salary estimates



## 🚀 Production Build

```bash
npm run build
npm start
```

## 📦 Future Integration

This frontend is ready for backend integration:
- File upload endpoints
- AI analysis APIs
- Job search APIs
- Interview scheduling
- Vapi voice/video integration
- Course recommendation API
- Salary data API







**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
