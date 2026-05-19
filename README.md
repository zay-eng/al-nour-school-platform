# 🎓 Al-Nour School Management Platform

A comprehensive, secure, and modern school management system built with React and Laravel.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)

## ✨ Features

### 👨‍💼 Administrator Dashboard
- 📊 **Student Management** - Complete student records and enrollment
- 👨‍🏫 **Teacher Management** - Staff profiles and assignments
- 💰 **Financial Management** - Payments, invoices, and reports
- 📢 **Announcements System** - School-wide communications with approval workflow
- 💬 **Messaging System** - Direct communication with teachers and parents
- 📈 **Analytics & Reports** - Comprehensive insights and statistics

### 👨‍🏫 Teacher Dashboard
- 📚 **Course Management** - Upload and manage lesson materials
- 📝 **Grades Management** - Enter and track student grades with filters
- 📋 **Attendance Tracking** - Mark student attendance by class
- 📢 **Announcements** - Create announcements (requires admin approval)
- 💬 **Parent Communication** - Message parents directly with file sharing
- 📊 **Report Cards** - Generate and download student report cards

### 👨‍👩‍👧 Parent Dashboard
- 👦 **Student Overview** - View child's academic performance
- 📊 **Grades & Progress** - Detailed grades by subject with history
- ✅ **Attendance Records** - Calendar view of presence/absence
- 📢 **School Events** - View announcements and upcoming events
- 💬 **Teacher Communication** - Message teachers and admin
- 💳 **Payment Management** - View and pay school fees online

## 🔒 Security Features

- ✅ **Authentication** - Secure token-based auth with Laravel Sanctum
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Sanitization** - XSS and injection attack prevention
- ✅ **Security Headers** - Comprehensive HTTP security headers
- ✅ **RBAC** - Role-based access control (Admin, Teacher, Parent)
- ✅ **Audit Logging** - Complete security event tracking
- ✅ **Strong Password Policy** - Enforced password complexity
- ✅ **CORS Protection** - Restricted cross-origin requests

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **PHP** 8.2+ (for backend)
- **Composer** (PHP package manager)
- **MySQL/PostgreSQL** (database)
- **XAMPP** (recommended for local development on Windows)

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/zay-eng/al-nour-school-platform.git
cd al-nour-school-platform
```

#### 2️⃣ Backend Setup (Laravel)
```bash
# Navigate to backend folder
cd al-nour-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# Edit DB_CONNECTION, DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Run migrations and seed database
php artisan migrate --seed

# Start backend server
php artisan serve
```

Backend will run on: **http://localhost:8000**

#### 3️⃣ Frontend Setup (React)
```bash
# Open a new terminal and navigate to frontend folder
cd al-nour-frontend

# Install Node dependencies
npm install

# Create environment file (if needed)
# Make sure VITE_API_URL points to http://localhost:8000

# Start frontend development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 🎯 One-Command Setup (After Clone)

**For Windows (PowerShell):**
```powershell
# Backend
cd al-nour-backend ; composer install ; cp .env.example .env ; php artisan key:generate ; php artisan migrate --seed ; php artisan serve

# Frontend (in new terminal)
cd al-nour-frontend ; npm install ; npm run dev
```

**For Linux/Mac:**
```bash
# Backend
cd al-nour-backend && composer install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed && php artisan serve

# Frontend (in new terminal)
cd al-nour-frontend && npm install && npm run dev
```

### 🔑 Default Login Credentials

After seeding the database, use these credentials:

```
📧 Email: admin@alnour.edu
🔒 Password: Admin@123
👤 Role: Administrator

📧 Email: teacher@alnour.edu
🔒 Password: Teacher@123
👤 Role: Teacher

📧 Email: parent@alnour.edu
🔒 Password: Parent@123
👤 Role: Parent
```

**⚠️ IMPORTANT: Change these passwords immediately in production!**

### ⚙️ Database Configuration

Edit `al-nour-backend/.env` file:

**For MySQL (XAMPP):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=al_nour_school
DB_USERNAME=root
DB_PASSWORD=
```

**For PostgreSQL:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=al_nour_school
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Don't forget to create the database first:
```sql
CREATE DATABASE al_nour_school;
```

## 📁 Project Structure

```
al-nour-school-platform/
├── al-nour-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── dashboards/    # Dashboard components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── teacher/       # Teacher-specific components
│   │   │   └── common/        # Shared components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── assets/            # Images and static files
│   └── package.json
│
├── backend-files/             # Laravel backend application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API controllers
│   │   │   └── Middleware/    # Custom middleware
│   │   └── Models/            # Eloquent models
│   ├── config/                # Configuration files
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── routes/                # API routes
│   └── storage/               # Logs and uploads
│
├── docs/                      # Documentation
│   ├── installation/          # Setup guides
│   ├── security/              # Security documentation
│   ├── features/              # Feature documentation
│   └── integration/           # Integration guides
│
├── .gitignore
├── README.md
└── LICENSE
```

## 📚 Documentation

- **[Installation Guide](docs/installation/)** - Detailed setup instructions
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture overview
- **[Security](docs/security/)** - Security implementation details
- **[Features](docs/features/)** - Feature documentation
- **[API Documentation](docs/integration/)** - API endpoints and integration
- **[Roadmap](docs/ROADMAP.md)** - Future development plans

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v6
- **State Management:** React Context API

### Backend
- **Framework:** Laravel 11.x
- **Language:** PHP 8.2
- **Database:** MySQL/MariaDB
- **Authentication:** Laravel Sanctum
- **API:** RESTful API
- **Validation:** Laravel Validation
- **Logging:** Monolog

## 🧪 Testing

### Frontend Tests
```bash
cd al-nour-frontend
npm run test
```

### Backend Tests
```bash
cd backend-files
php artisan test
```

## 🔐 Security

This project takes security seriously. We implement:

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure password hashing
- Security headers
- Audit logging

For security concerns, please see [SECURITY.md](docs/security/SECURITY_OVERVIEW.md).

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Laravel community for the excellent framework
- React team for the amazing library
- All contributors who helped with this project

## 📞 Support

For support, email support@alnour.edu or open an issue on GitHub.

## 🗺️ Roadmap

See [ROADMAP.md](docs/ROADMAP.md) for planned features and improvements.

---

**Made with ❤️ for Al-Nour School**
