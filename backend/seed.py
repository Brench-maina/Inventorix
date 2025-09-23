from app import app
from models import db, User, Category, Warehouse, Product, product_warehouses

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

    # ------------------ PRODUCTS ------------------
    products = [
        Product(name="Laptop", price=1200.00, category_id=1, user_id=1),
        Product(name="Office Chair", price=150.00, category_id=2, user_id=1),
        Product(name="Printer", price=300.00, category_id=1, user_id=1)
    ]
    db.session.add_all(products)
    db.session.flush()  # Get IDs before committing

    # ------------------ LINK PRODUCTS TO WAREHOUSES ------------------
    product_warehouse_links = [
        {"product_id": products[0].id, "warehouse_id": 1, "quantity": 15},  # Laptop -> Main Warehouse
        {"product_id": products[0].id, "warehouse_id": 2, "quantity": 10},  # Laptop -> Westside Storage
        {"product_id": products[1].id, "warehouse_id": 2, "quantity": 30},  # Office Chair -> Westside Storage
        {"product_id": products[2].id, "warehouse_id": 1, "quantity": 8},   # Printer -> Main Warehouse
    ]

    for link in product_warehouse_links:
        stmt = product_warehouses.insert().values(
            product_id=link['product_id'],
            warehouse_id=link['warehouse_id'],
            quantity=link['quantity']
        )
        db.session.execute(stmt)

    db.session.commit()
    
    print("Database seeded successfully!")