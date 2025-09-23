from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates 
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Relationships
    products = db.relationship('Product', backref='user', cascade='all, delete-orphan')
    
    serialize_rules = ('-products.user', '-_password_hash')
    
    @property
    def password(self):
        raise AttributeError('Password is not readable')
    
    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)
    
    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)
    
    @validates('username')
    def validate_username(self, key, username):
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email

    def __repr__(self):
        return f"<User id={self.id} username='{self.username}' email='{self.email}'>"
    

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    in_stock = db.Column(db.Boolean, default=True)
    
    # Relationships
    products = db.relationship('Product', backref='category', cascade='all, delete-orphan')
    
    serialize_rules = ('-products.category',)

    def __repr__(self):
        return f"<Category id={self.id} name='{self.name}'>"

class Warehouse(db.Model, SerializerMixin):
    __tablename__ = 'warehouses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    supplier = db.Column(db.String(100))
    
    # Relationships
    products = db.relationship('Product', backref='warehouse', cascade='all, delete-orphan')
    
    serialize_rules = ('-products.warehouse',)

    def __repr__(self):
        return f"<Warehouse id={self.id} name='{self.name}' location='{self.location}'>"


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Foreign keys
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    serialize_rules = ('-category.products', '-warehouse.products', '-user.products')
    
    @validates('price')
    def validate_price(self, key, price):
        if price <= 0:
            raise ValueError("Price must be positive")
        return price
    
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        if quantity < 0:
            raise ValueError("Quantity cannot be negative")
        return quantity

    def __repr__(self):
        return f"<Product id={self.id} name='{self.name}' price={self.price} qty={self.quantity}>"
