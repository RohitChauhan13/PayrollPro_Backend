# 💼 PayrollPro Backend - Payroll & HR Management API

PayrollPro Backend is a **Node.js + Express REST API server** that powers the PayrollPro React Native mobile application.  
It handles employee management, payroll processing, authentication, and HR-related operations through secure APIs.

---

## 🚀 Features

- 👨‍💼 Employee Management APIs
- 💰 Payroll calculation & processing logic
- 🧾 Payslip generation support
- 🏢 Company/HR data management
- 📡 RESTful API architecture
- 🔐 Secure environment configuration
- ⚡ Scalable backend structure
- 🗄️ MySQL database integration

---

## 🧠 Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2 (DB connector)
- dotenv (Environment variables)
- nodemon (development server)

---

## 📁 Project Structure

```
PayrollPro_Backend/
│
├── config/
│   └── db.js              # Database connection setup
│
├── routes/
│   ├── employee.routes.js
│   ├── payroll.routes.js
│   └── auth.routes.js
│
├── controllers/          # Business logic layer
├── services/             # Core service logic
├── middlewares/          # Auth & validation middleware
│
├── index.js              # Entry point
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```env
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

SERVER_PORT=3000
```

---

## ▶️ How to Run the Project

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Start Development Server

```bash
nodemon index.js
```

OR

```bash
node index.js
```

---

## 📡 API Endpoints

### 👨‍💼 Employee APIs
```
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

---

### 💰 Payroll APIs
```
GET    /api/payroll
POST   /api/payroll/calculate
```

---

### 🔐 Auth APIs (if enabled)
```
POST   /api/login
POST   /api/register
```

---

## 🔁 How It Works

1. Mobile app (React Native) sends request
2. Backend receives API request
3. Business logic processes payroll/employee data
4. MySQL database stores/retrieves data
5. Response is sent back to mobile app

---

## 🗄️ Database Setup

Make sure MySQL is running and create database:

```sql
CREATE DATABASE payrollpro;
```

Then configure `.env` file accordingly.

---

## 🚀 Future Improvements

- 🔐 JWT authentication system
- 📊 Admin dashboard APIs
- 📄 PDF payslip generation
- ☁️ Cloud deployment (AWS / Render / Railway)
- 🔄 Redis caching for performance
- 📱 Real-time notifications (WebSockets)

---

## 🧠 Key Highlights

- Clean modular architecture
- Scalable REST API design
- Mobile-first backend system
- Easily extendable for enterprise payroll systems

---

## 👨‍💻 Author

Developed as a backend system for PayrollPro React Native application.

---

## 📜 License

This project is licensed under the MIT License.

**Author: ROHIT CHAUHAN**