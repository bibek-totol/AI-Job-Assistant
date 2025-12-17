# AI Job Assistant (Still Developing)

A modern, premium-quality frontend application for an AI-powered job assistance platform built with Next.js, TypeScript, Openrouter and Tailwind CSS.

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

### 6. **Cover Letter Creation ** (`/generate-cover-letter`)
- AI-driven cover letter  generation
- Customize Cover Letter

 ### 6. **Pricing and Contact Us Section** 
- Pricing for different plans of subscription
- Contact Page for Additional Information

### Installation

1. Clone repository:
```bash
git clone https://github.com/bibek-totol/AI-Job-Assistant.git
cd AI-Job-Assistant
```

2. Copy environment file
```bash
cp .env.example .env
```

3.  Fill in your environment variables in .env

4. Running Locally with Docker:
```bash
docker-compose up --build 
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

6.  If you want to stop the docker container(Optional):
```bash
docker-compose down

```


##  Design System


## Project UI:
![Screenshot_93](https://github.com/user-attachments/assets/ff72c969-4e9b-45c8-b895-fc6a87d807a0)
![Screenshot_94](https://github.com/user-attachments/assets/ec3b5fd1-5a3a-4cba-9231-2c6cd035ada8)
![Screenshot_82](https://github.com/user-attachments/assets/95efd252-bfab-446a-b164-fd4d89b7fdd7)
![Screenshot_83](https://github.com/user-attachments/assets/93379779-9fe0-40c4-bad5-c99d5c18cf2e)
![Screenshot_84](https://github.com/user-attachments/assets/b632a66f-5f55-4a33-b900-93da25e9b73b)
![Screenshot_85](https://github.com/user-attachments/assets/3bb429fc-6aca-4238-9344-bb007a6c9a5a)
![Screenshot_86](https://github.com/user-attachments/assets/8619760c-2d4a-4838-9085-8dba189de5c2)
![Screenshot_87](https://github.com/user-attachments/assets/03764055-5ffa-4f84-8f59-925f755e45bb)
![Screenshot_88](https://github.com/user-attachments/assets/c452773b-1338-4926-910b-10f13ca60646)
![Screenshot_89](https://github.com/user-attachments/assets/1b08fca3-1f3d-45b4-b384-55a892539e28)
![Screenshot_90](https://github.com/user-attachments/assets/7c5426f6-b031-4991-907d-925908e16d05)
![Screenshot_91](https://github.com/user-attachments/assets/b23e5ee0-0d1f-44ed-ad44-0e79169b4ed0)
![Screenshot_92](https://github.com/user-attachments/assets/9c394675-946d-4654-a055-72814933a901)



## 📂 Project Structure


```text
app/
├── api/                        # Backend API routes
│   ├── analyze-resume/         # Resume analysis endpoint
│   ├── generate-cover-letter/  # Cover letter generation endpoint
│   ├── job-suggestions/        # Job recommendation endpoint
│   └── recommend-courses/      # Course recommendation endpoint
├── contact/                    # Contact Us page
├── courses/                    # Course recommendations page
├── cover-letter/               # Cover letter generator page
├── interview/                  # AI Interview practice page
├── interview-scheduler/        # Interview scheduling page
├── job-suggestions/            # Job suggestions page
├── pricing/                    # Pricing and plans page
├── resume-checker/             # Resume analysis page
├── favicon.ico                 # Application favicon
├── globals.css                 # Global styles and Tailwind imports
├── layout.tsx                  # Root layout (Navbar, Footer, Fonts)
└── page.tsx                    # Landing page (Home)

```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Next Google Fonts
- **Icons**: Lucide  React
- **API**: Open Router LLM (AI)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn



## 📄 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and testimonials |
| `/resume-checker` | Upload and analyze resumes for ATS compatibility |
| `/job-suggestions` | AI-powered job search and matching |
| `/interview-scheduler` | Schedule AI interviews with auto-generated questions |
| `/interview/[id]` | Dynamic interview entry page for candidates |
| `/courses` | Personalized course recommendations |
| ` /generate-cover-letter` | Cover Letter Creation |
| ` /pricing` | Price Subscription |
| ` /contact` | Contact with Us |



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




## 🚀 Production Build

```bash
npm run build
npm start
```

## 📦 Future Integration

This frontend is ready for backend integration:
- Interview scheduling
- Vapi voice/video integration
- Salary data API





