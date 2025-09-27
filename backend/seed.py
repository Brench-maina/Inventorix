from app import app
from models import db, User, Category, Warehouse, Product

with app.app_context():
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    # Users
    users = [
        User(
            business_name="Tech Solutions Ltd",
            username="admin",
            email="admin@techsolutions.com",
            password="password123"
        ),
        User(
            business_name="Global Electronics",
            username="user1",
            email="user1@globalelectronics.com",
            password="password123"
        )
    ]
    db.session.add_all(users)
    db.session.commit()

    admin_user = users[0] 

    # Categories 
    categories = [
        Category(name="Electronics", in_stock=True, user_id=admin_user.id),
        Category(name="Furniture", in_stock=True, user_id=admin_user.id),
        Category(name="Office Supplies", in_stock=True, user_id=admin_user.id),
        Category(name="Hardware", in_stock=False, user_id=admin_user.id)
    ]
    db.session.add_all(categories)
    db.session.commit()

    # Warehouses
    warehouses = [
        Warehouse(name="Main Warehouse", location="Nairobi", supplier="Primary Supplier", user_id=admin_user.id),
        Warehouse(name="Westside Storage", location="Mombasa", supplier="Coastal Suppliers", user_id=admin_user.id),
        Warehouse(name="Central Depot", location="Kisumu", supplier="Lake Region Suppliers", user_id=admin_user.id)
    ]
    db.session.add_all(warehouses)
    db.session.commit()

    # Products
    products = [
        Product(
            name="Laptop",
            price=1200.00,
            quantity=15,
            category_id=categories[0].id,
            warehouse_id=warehouses[0].id,  
            user_id=admin_user.id
        ),
        Product(
            name="Office Chair",
            price=150.00,
            quantity=30,
            category_id=categories[1].id,
            warehouse_id=warehouses[1].id,  
            user_id=admin_user.id
        ),
        Product(
            name="Printer",
            price=300.00,
            quantity=8,
            category_id=categories[0].id,
            warehouse_id=warehouses[0].id,  
            user_id=admin_user.id
        )
    ]
    db.session.add_all(products)
    db.session.commit()

    print("Database seeded successfully!" )