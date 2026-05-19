# 🔧 Troubleshooting Guide

## Login Issues

### Problem: "بيانات الدخول غير صحيحة" (Invalid credentials)

#### Solution 1: Database Not Seeded
The most common issue is that the database wasn't seeded with users.

**Fix:**
```bash
cd al-nour-backend
php artisan migrate:fresh --seed
```

This will:
- Drop all tables
- Recreate all tables
- Seed the database with 5 test users

#### Solution 2: Wrong Credentials
Make sure you're using the correct credentials:

```
Email: teacher@alnour.edu
Password: Teacher@123
```

**Important:** 
- Password is case-sensitive (capital T)
- Must include the @ symbol
- No spaces

#### Solution 3: Backend Not Running
Make sure the backend server is running:

```bash
cd al-nour-backend
php artisan serve
```

Should show: `Server running on [http://127.0.0.1:8000]`

#### Solution 4: Check Database Connection
Verify your `.env` file in `al-nour-backend`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=al_nour_school
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Test connection:
```bash
php artisan db:show
```

#### Solution 5: CORS Issues
If you see CORS errors in browser console, check:

1. Backend is running on `http://localhost:8000`
2. Frontend is running on `http://localhost:5173`
3. CORS config in `config/cors.php` includes your frontend URL

---

## All User Credentials

After running `php artisan migrate:fresh --seed`, these users are created:

| Email | Password | Role |
|-------|----------|------|
| admin@alnour.edu | Admin@123 | Administrator |
| teacher@alnour.edu | Teacher@123 | Teacher |
| parent@alnour.edu | Parent@123 | Parent |
| fatima.teacher@alnour.edu | Teacher@123 | Teacher |
| sara.parent@alnour.edu | Parent@123 | Parent |

---

## Testing Backend Directly

Test if backend is working:

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"email":"teacher@alnour.edu","password":"Teacher@123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "access_token": "...",
  "user": { ... }
}
```

---

## Common Issues

### Issue: "Connection refused"
- Backend server is not running
- **Fix:** Run `php artisan serve` in `al-nour-backend` folder

### Issue: "Database not found"
- Database doesn't exist
- **Fix:** Create database: `CREATE DATABASE al_nour_school;`

### Issue: "SQLSTATE[HY000] [2002]"
- PostgreSQL is not running
- **Fix:** Start PostgreSQL service

### Issue: Frontend shows blank page
- Frontend server is not running
- **Fix:** Run `npm run dev` in `al-nour-frontend` folder

### Issue: "Module not found"
- Dependencies not installed
- **Fix:** Run `npm install` in frontend or `composer install` in backend

---

## Quick Reset

If everything is broken, start fresh:

```bash
# Backend
cd al-nour-backend
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve

# Frontend (new terminal)
cd al-nour-frontend
npm install
npm run dev
```

---

## Need More Help?

1. Check browser console for errors (F12)
2. Check backend logs in `al-nour-backend/storage/logs/laravel.log`
3. Verify both servers are running:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173
