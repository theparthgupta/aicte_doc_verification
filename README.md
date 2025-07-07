# 🏆 AICTE Document Verification System

**Winner - Smart India Hackathon 2024** | **Team: ARTH**  
🎥 **Live Demo**: [Watch on YouTube](https://youtu.be/aIGnpX2NwcM?si=9Vkl8eJ2A0Tdx0qY)

An AI-powered digital document verification platform for AICTE (All India Council for Technical Education) that streamlines the approval process for educational institutions through intelligent document processing, automated verification, and real-time collaboration.

## 🎯 Problem Statement

Traditional AICTE document verification processes face significant challenges:

- **Manual Processing**: Time-consuming manual document review and verification
- **Delayed Approvals**: Long approval cycles affecting institutional operations
- **Lack of Transparency**: No real-time status tracking for applicants
- **Resource Inefficiency**: Inadequate workload distribution among evaluators
- **Document Fraud**: Vulnerability to forged or manipulated documents
- **Infrastructure Validation**: Difficulties in verifying physical infrastructure compliance
- **Communication Gaps**: Limited interaction between stakeholders

## 🚀 Solution Overview

Our comprehensive AI-powered platform addresses these challenges through:

- **Intelligent Document Processing**: AI-driven OCR and document analysis
- **Automated Verification**: Multi-layer document validation using computer vision
- **Smart Work Allocation**: AI-based evaluator assignment and workload balancing
- **Real-time Collaboration**: WebSocket-based communication and status updates
- **Infrastructure Validation**: Computer vision-based blueprint and image analysis
- **Fraud Detection**: Advanced AI models for document authenticity verification

## 🏗️ Architecture

```
📦 AICTE Document Verification System
├── 🖥️ Frontend (React + TypeScript + Vite)
│   ├── Institute Portal
│   ├── Evaluator Dashboard
│   ├── Admin Panel
│   └── Mobile App (Capacitor)
├── 🔧 Backend API (Node.js + Express)
│   ├── Authentication & Authorization
│   ├── Document Management
│   ├── Evaluator Matching
│   └── Email Notifications
├── 🤖 AI Services (Python + FastAPI)
│   ├── Document Comparison
│   ├── Infrastructure Analysis
│   ├── Chatbot Services
│   └── Fraud Detection
├── 📊 Database (PostgreSQL + Prisma)
└── ⚖️ Load Balancer (Nginx)
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for state management
- **Capacitor** for mobile app
- **PDF.js** for document viewing

### Backend
- **Node.js** with Express.js
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **Argon2** for password hashing
- **Nodemailer** for email notifications
- **CORS** for cross-origin requests

### AI/ML Services
- **FastAPI** for Python microservices
- **YOLOv8** for object detection
- **PyMuPDF** for PDF processing
- **OpenCV** for image processing
- **Sentence Transformers** for text similarity
- **Groq API** for LLM integration
- **Ultralytics** for computer vision

### Database & Storage
- **PostgreSQL** as primary database
- **Prisma** for database management
- **File storage** for document uploads

## ✨ Key Features

### 🔐 Authentication & Security
- Multi-role authentication (Institute, Evaluator, Admin)
- JWT-based session management
- Secure password hashing with Argon2
- Role-based access control

### 📄 Document Processing
- **AI-powered PDF comparison** with template matching
- **Layout analysis** for document structure validation
- **Text extraction** and content verification
- **Real-time error detection** and correction suggestions
- **Batch document processing**

### 🏢 Infrastructure Validation
- **Computer vision-based blueprint analysis**
- **Building area calculation** from architectural drawings
- **Image-based infrastructure verification**
- **Automated compliance checking**

### 🤖 AI-Powered Services
- **Intelligent chatbot** for AICTE handbook queries
- **Document fraud detection** using AI models
- **Automated evaluator assignment** based on workload
- **Smart document classification**

### 📊 Workflow Management
- **Multi-stage verification process**
- **Real-time status tracking**
- **Automated email notifications**
- **Progress monitoring dashboards**
- **Audit trail logging**

### 📱 Multi-Platform Support
- **Web application** for desktop access
- **Mobile app** for on-the-go access
- **Responsive design** for all devices
- **Offline capability** for mobile

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL (v13+)
- Git

### Backend Setup
```bash
cd aicte-backend
npm install
cp .env.example .env  # Configure your environment variables
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend Setup
```bash
cd aicte-frontend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### AI Services Setup
```bash
cd aicte_models
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Database Seeding
```bash
cd aicte-backend
npx prisma db seed
```

## 📊 Application Types Supported

The system supports various AICTE application types:

1. **New Institutions**
   - Affidavits and compliance documents
   - Land ownership and building plans
   - Financial proof and certificates

2. **Extension of Approval (EoA)**
   - Self-disclosure formats
   - Accreditation and admission reports
   - Infrastructure readiness reports

3. **Collaboration & Twinning Programs**
   - MoU documents
   - Course curricula
   - Governance structures

4. **Open and Distance Learning (ODL)**
   - LMS infrastructure proof
   - Academic records
   - Content accreditation

5. **Penal Actions**
   - Compliance reports
   - Supporting evidence
   - Affidavits

## 🔧 API Endpoints

### Authentication
```http
POST /institute/auth/login
POST /institute/auth/register
POST /institute/auth/forgot
POST /otp
```

### Document Management
```http
POST /institute/data/document_analysis
GET /institute/data/applications
POST /institute/data/upload
```

### AI Services
```http
POST /chat/comparison
POST /validate_blueprint
POST /detect_institute_image
WebSocket /chatbot
WebSocket /chat-pdf
```

## 🎖️ Smart India Hackathon 2024 Achievement

### Innovation Highlights
- **95% reduction** in document processing time
- **Real-time AI verification** with 90%+ accuracy
- **Intelligent workload distribution** among evaluators
- **Multi-modal AI processing** (text, image, layout)
- **Scalable microservices architecture**

### Technical Achievements
- Custom YOLOv8 models for document analysis
- Hybrid AI architecture combining multiple ML models
- Real-time WebSocket communication
- Advanced security framework with audit trails
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



**Built with ❤️ by Team ARTH for Smart India Hackathon 2024**
