from app import app
from models import db, User, Category, Warehouse, Product

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # Create users
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

    # Create categories
    categories = [
        Category(name="Electronics", in_stock=True),
        Category(name="Furniture", in_stock=True),
        Category(name="Office Supplies", in_stock=True),
        Category(name="Hardware", in_stock=False)
    ]
    db.session.add_all(categories)
    db.session.commit()

    # Create warehouses
    warehouses = [
        Warehouse(name="Main Warehouse", location="Nairobi", supplier="Primary Supplier"),
        Warehouse(name="Westside Storage", location="Mombasa", supplier="Coastal Suppliers"),
        Warehouse(name="Central Depot", location="Kisumu", supplier="Lake Region Suppliers")
    ]
    db.session.add_all(warehouses)
    db.session.commit()

    # Create products
    products = [
        Product(
            name="Laptop",
            price=1200.00,
            quantity=15,
            category_id=1,
            warehouse_id=1,
            user_id=1
        ),
        Product(
            name="Office Chair",
            price=150.00,
            quantity=30,
            category_id=2,
            warehouse_id=2,
            user_id=1
        ),
        Product(
            name="Printer",
            price=300.00,
            quantity=8,
            category_id=1,
            warehouse_id=1,
            user_id=1
        )
    ]
    db.session.add_all(products)
    db.session.commit()

    print("Database seeded successfully!")