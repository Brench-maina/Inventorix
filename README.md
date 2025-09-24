# Inventorix# 

Inventorix is a full-stack inventory management system built with **Flask** (backend) and **React (Vite)** (frontend).  
It allows businesses to manage products, suppliers, and warehouses efficiently.

---

##  Features

-  User authentication (Sign up, Log in, Secure access)
-  Product management (Add, edit, delete, list products)
-  Warehouse management
-  Supplier management
-  Dashboard & stats overview
-  Responsive UI with professional styling

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios (API calls)
- Tailwind CSS / Custom CSS (for styling)

**Backend**
- Python (Flask)
- Flask SQLAlchemy (ORM)
- Flask-Migrate (database migrations)
- SQLite (default database, can be swapped for PostgreSQL/MySQL)
- Seed script for demo data

**Managing Inventory**
Setup Phase: Use the "Inventory Setup" page to create warehouses and categories
Add Products: Navigate to "Add Product" to create new inventory items
View Inventory: Check "Products" page to see all items
Organize: Use "Categories" page to manage product groupings

**API Endpoints**

**Authentication**

    POST /login - User login

    POST /users - User registration

**Products**

    GET /products - Get all products

    POST /products - Create new product

    GET /products/<id> - Get specific product

    PATCH /products/<id> - Update product

    DELETE /products/<id> - Delete product

**Categories**

    GET /categories - Get all categories

    POST /categories - Create new category

    PATCH /categories/<id> - Update category

    DELETE /categories/<id> - Delete category

**Warehouses****

    GET /warehouses - Get all warehouses

    POST /warehouses - Create new warehouse

    PATCH /warehouses/<id> - Update warehouse

    DELETE /warehouses/<id> - Delete warehouse

**Backend setup**
cd backend
python3 -m venv venv
source venv/bin/activate   

pip install -r requirements.txt

# Initialize database
flask --app app db init
flask --app app db migrate -m "Initial migration"
flask --app app db upgrade

# (Optional) Seed demo data
python seed.py

# Run server
python app.py

**Frontend setup(using vite)**
npm create vite@latest frontend --template react
cd frontend
npm install
npm run dev

**License**

This project is licensed under the MIT License.

**Author**
<br>
1.Imran Ahmed
2.Brench Maina
</br>