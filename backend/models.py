from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from datetime import datetime
import os

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='user', cascade='all, delete-orphan')
    categories = db.relationship('Category', backref='user', cascade='all, delete-orphan')
    warehouses = db.relationship('Warehouse', backref='user', cascade='all, delete-orphan')

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)

    def generate_token(self, expires_sec=3600):
        """Generate a timed JWT-like token."""
        s = URLSafeTimedSerializer(os.getenv('SECRET_KEY', 'dev-secret-key'))
        return s.dumps({'user_id': self.id})

    @staticmethod
    def verify_token(token, max_age=3600):
        """Verify and decode token."""
        s = URLSafeTimedSerializer(os.getenv('SECRET_KEY', 'dev-secret-key'))
        try:
            data = s.loads(token, max_age=max_age)
            return User.query.get(data['user_id'])
        except (BadSignature, SignatureExpired):
            return None

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

    def to_dict(self):
        return {
            "id": self.id,
            "business_name": self.business_name,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    in_stock = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    products = db.relationship('Product', backref='category', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "in_stock": self.in_stock,
            "user_id": self.user_id
        }

class Warehouse(db.Model):
    __tablename__ = 'warehouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    supplier = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # One-to-many: warehouse → products
    products = db.relationship('Product', backref='warehouse', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "supplier": self.supplier,
            "user_id": self.user_id
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)  # ✅ one warehouse

    @validates('price')
    def validate_price(self, key, price):
        if price <= 0:
            raise ValueError("Price must be positive")
        return price

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Product name cannot be empty")
        return name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "category_id": self.category_id,
            "warehouse_id": self.warehouse_id,
            "category": self.category.name if self.category else None,
            "warehouse": self.warehouse.name if self.warehouse else None
        }
