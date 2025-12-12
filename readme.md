# Vehicle Dealership Final Project
### Final Project — Web Backend Development

https://cse340-final-project-jeppesen.onrender.com/

## Overview  
This project is a full-stack backend system for a vehicle dealership web application. It includes public-facing pages, authenticated user features, and two administrative dashboards (Employee and Owner). The system supports viewing vehicles, managing inventory, submitting service requests, handling reviews, and processing contact form submissions.

The backend follows RESTful principles and uses a relational database to store all application data.

---

## Features

### Public Pages  
Accessible to all visitors:

- **Home Page** showing featured vehicles  
- **Catalog:** Trucks, Vans, Cars, SUVs  
- **Vehicle Detail Pages:** Image gallery, full specs, pricing  
- **Contact Form:** User inquiries saved to the database
- **Dashboard:** Access user information, leave reviews, and service requests

---

### User Features (Authentication Required)  
Logged-in users can:

- **Leave reviews** on vehicles  
- **Delete their own reviews**  
- **Submit service requests** (oil changes, inspections, repairs, etc.)  

---

### Owner and Employee Dashboard  
Employees have elevated permissions to manage site content and user submissions:

- **Moderate/Delete user reviews**  
- **View & manage service requests**  
- **Update service request statuses**  
- **View all contact form submissions**

---

## Database Schema Requirements  

Your database must include the following tables:

### **Users**  
- `id`  
- `name`  
- `email`  
- `password`  
- `role` — (`user`, `employee`, `owner`)  
- Timestamps  

### **Categories**  
- `id`  
- `name`  

### **Vehicles**  
- `id`  
- `category_id` (FK → Categories)  
- `make`  
- `model`
- `slug`
- `year`  
- `price`  
- `description`  
- `availability`  
- Timestamps  

### **Reviews**  
- `id`  
- `user_id` (FK → Users)  
- `vehicle_slug`
- `rating`  
- `comment`  
- Timestamps  

### **Service Requests**  
- `id`  
- `user_id` (FK → Users)  
- `vehicle_description`
- `vehicle_plate`
- `service_type`  
- `status` (`Submitted`, `Pending`, `Completed`)  
- `notes`  
- Timestamps  

### **Contact Messages**  
- `id`  
- `email`
- `subject`
- `message`  
- Timestamps  

---

## Authentication & Roles  
The system should implement secure authentication (JWT or session-based).  
Role-based access control governs access to admin and employee routes.

- **User:** Can write reviews, request services  
- **Employee:** Can manage vehicles, reviews, and service workflows  
- **Owner:** Full system control  

---

## API Structure

- Public routes:
  - `GET /` — Home page
  - `GET /catalog` — Vehicle catalog listing
  - `GET /catalog/:vehicleSlug` — Vehicle detail page
  - `GET /contact` — Contact form
  - `POST /contact` — Submit contact form (validated)

- Authentication:
  - `GET /register` — Registration form
  - `POST /register` — Process registration (validated)
  - `GET /login` — Login form
  - `POST /login` — Process login (validated)
  - `GET /logout` — Logout

- User dashboard & account (require login):
  - `GET /dashboard` — User dashboard
  - `GET /user/:id/edit` — Edit account form
  - `POST /user/:id/edit` — Update account
  - `POST /user/:id/delete` — Delete account

- Admin (require owner/employee):
  - `GET /admin` — Admin dashboard (owner/employee)
  - `GET /admin/contact-responses` — View contact submissions (owner/employee)
  - `GET /admin/users` — User management (owner)

---

## Technologies Used  

- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Authentication:** session-based auth   
- **Frontend:** EJS

---

## Running the Project  

Install dependencies:

```bash
pnpm install
```

Run the development server

```bash
pnpm run dev
```

Env Variables
```env
DB_URL=
ENABLE_SQL_LOGGING=false
PORT=
NODE_ENV=development
SESSION_SECRET=
```
