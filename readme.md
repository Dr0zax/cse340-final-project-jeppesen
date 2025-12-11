# Vehicle Dealership Final Project
### Final Project — Web Backend Development

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

---

### User Features (Authentication Required)  
Logged-in users can:

- **Leave reviews** on vehicles  
- **Edit/Delete their own reviews**  
- **Submit service requests** (oil changes, inspections, repairs, etc.)  
- **View their service request history** with statuses  
  - *Submitted → In Progress → Completed*  

---

### Employee Dashboard  
Employees have elevated permissions to manage site content and user submissions:

- **Edit vehicle details:** price, description, availability  
- **Moderate/Delete user reviews**  
- **View & manage service requests**  
- **Update service request statuses**  
- **Add internal notes** to service requests  
- **View all contact form submissions**

---

### Owner Dashboard (Full Admin Access)  
Owners have full system control, including everything employees can do *plus*:

- **Manage categories:** Add, edit, delete categories  
- **Manage inventory:** Add, edit, delete vehicles  
- **Manage employee accounts** (optional — may be hardcoded)  
- **View all system activity and user data**

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
- `year`  
- `price`  
- `description`  
- `availability`  
- Timestamps  

### **Vehicle Images**  
- `id`  
- `vehicle_id` (FK → Vehicles)  
- `image_path`  

### **Reviews**  
- `id`  
- `user_id` (FK → Users)  
- `vehicle_id` (FK → Vehicles)  
- `rating`  
- `comment`  
- Timestamps  

### **Service Requests**  
- `id`  
- `user_id` (FK → Users)  
- `vehicle_id` (optional FK → Vehicles owned by user)  
- `service_type`  
- `status` (`Submitted`, `Pending`, `Completed`)  
- `notes`  
- Timestamps  

### **Contact Messages**  
- `id`  
- `name`  
- `email`  
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

- `GET /regitser`
- `POST /register`
- `GET /login`
- `POST /login`
- `POST /logout`

- `/dashboard`
- `POST /edit (owner of account)`
- `POST /change-password (owner of account)`
- `GET /admin (owner/employee)`
- `GET /admin/service-requests (owner/employee)`
- `GET /admin/reviews (owner/employee)`

- `/vehicles`
- `GET /`
- `GET /:id`
- `POST / (owner)`
- `PUT /:id (employee/owner)`
- `DELETE /:id (owner)`

- `/categories`
- `GET /`
- `POST / (owner)`
- `PUT /:id (owner)`
- `DELETE /:id (owner)`

- `/reviews`
- `POST / (user)`
- `PUT /:id (owner of review)`
- `DELETE /:id (owner of review or employee)`

- `/service-requests`
- `POST / (user)`
- `GET /mine (user)`
- `GET / (employee/owner)`
- `PUT /:id/status (employee/owner)`

- `/contact`
- `POST /`
- `GET / (employee/owner)`


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
PORT=
NODE_ENV=
```
