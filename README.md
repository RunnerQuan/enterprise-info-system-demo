# **Enterprise Information Management System**

### **Description**
This project is the final assignment for the **Database Systems Lab** course.
This repository contains the complete implementation of an **Enterprise Information Management System** with a **Gin-based backend** and a **Vue-based frontend**. The system is designed to manage core enterprise data such as customer information, employee records, department details, and employee-department associations. It provides CRUD operations, advanced querying capabilities, and adheres to modern web application standards.

---

### **Features**
#### Backend (Gin Framework)
- RESTful APIs implemented using the high-performance **Gin** framework.
- **MySQL** database for persistent storage with table structures for customers, employees, departments, and their associations.
- Stored procedures, triggers, and indexes for optimized database operations.
- Authentication and role-based access control using `Users` table.
- Integrated with **GORM** or **database/sql** for database handling.

#### Frontend (Vue 3 + Pinia)
- Dynamic and responsive UI implemented using **Vue 3**.
- State management with **Pinia** for better reactivity and organization.
- HTTP client using **Axios** for API interactions.
- Modules for:
  - Customer management
  - Employee management
  - Department management
  - Employee-department association
- Error handling and real-time updates.

---

### **Technologies Used**
#### Backend:
- **Gin Framework** (Go)
- **MySQL** for database
- **GORM** / **database/sql**
- REST API design principles

#### Frontend:
- **Vue 3**
- **Pinia** for state management
- **Axios** for API communication
- Modern JavaScript (ES6+)

#### DevOps:
- Project management with **GitHub**
- Testing APIs using **Postman**

---

### **Setup Instructions**
#### Backend:
1. Install Go and MySQL.
2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
3. **Configure the database in `utils/database.go`.**
4. Run the backend server:
   ```bash
   go run main.go
   ```

#### Frontend:
1. Install Node.js.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

### **Usage**
1. Access the system via the frontend at `http://localhost:3000` (default).
2. Use the backend APIs running on `http://localhost:8080` for direct API interactions.
3. Features include:
   - Customer CRUD operations
   - Employee CRUD operations
   - Department CRUD operations
   - Employee-department management

---

### **Future Enhancements**
- Add JWT-based authentication and authorization for secure API access.
- Implement frontend testing with Jest or Cypress.
- Add deployment scripts for cloud-based deployment.
