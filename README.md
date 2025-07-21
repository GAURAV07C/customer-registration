# 📝 Customer Registration Form (Sales Executive Use)

A responsive form built for sales executives to register customers during field visits. The form captures customer details and real-time location using the browser's geolocation API.

---
## 🔗 Live Demo

[Click here to view the app](https://customer-registration-mocha.vercel.app/)

---

## 🚀 Features

- ✅ Form validation with Zod and React Hook Form
- 📍 Auto-detect location using browser geolocation
- 🔒 Password strength meter and match validation
- 📞 Auto-fill form if customer phone exists
- 📧 Email availability check
- 📊 Live character counter for address field
- 🌍 (Optional) Google Maps preview

---

## 📦 Tech Stack

| Layer     | Tools                            |
|-----------|----------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS |
| Form      | React Hook Form + Zod           |
| Backend   | Next.js App Router, Prisma ORM  |
| Database  | PostgreSQL / MySQL              |

---

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
https://github.com/GAURAV07C/customer-registration
cd customer-registration
```

### 2. install Dependencies
```
npm install

```
### 3. Configure Environment Variables
#### Create a .env file in the root:
```
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
```
#### Replace with your actual database credentials and DB name.
## Prisma Setup
 ### 4. Initialize and Migrate Database
 ```
npm run db:migrate

```

 ### 5. Preview Prisma Studio (optional)

 ```
npm run  db:studio
```
##  Run the App
### 6. Start the Development Server
```
npm run dev
```
#### Open http://localhost:3000 in your browser.


 ## Form Fields & Validations
 
  Field     | Validation                            |
|-----------|----------------------------------|
|  Full Name | Required, letters + space only |
|     Email	| Required, valid format, unique check    |
|      Phone Number |	Required, 10 digits, unique check |
|       Gender	Required (Male/Female/Other)    |
|    Date of Birth |	Required, must be 13+ years old |
| Address |	Required, min 10 characters|
|Password |	Required, min 6 characters|
|Confirm Password	 | Must match password|
|Latitude |	Auto-filled via browser GPS|
||Longitude	| Auto-filled via browser GPS|


```
customer-registration/
├── actions/
│   └── userRegistaonAction.ts
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── MapPreview.tsx
│   ├── PasswordStrengthMeter.tsx
│   ├── RegistrationForm.tsx
│   └── ui/
│       ├── alert-dialog.tsx
│       ├── button.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   │   ├── 20250719175246_init_db/
│   │   │   └── migration.sql
│   │   └── 20250720123306_init/
│   │       └── migration.sql
│   ├── migration_lock.toml
│   └── schema.prisma
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── validation/
│   └── uservalidation.ts
├── .env
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

```

- ✅ Evaluation Criteria (Assignment)
- ✅ Input Validations (20%)
- ✅ Location Capture (20%)
- ✅ UI/UX and Structure (20%)
- ✅ Code Quality & Comments (20%)
- ✅ Bonus Features (20%)
  
---



