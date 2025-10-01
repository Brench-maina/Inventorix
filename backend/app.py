from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User, Product, Category, Warehouse
from auth import token_required
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventorix.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

CORS(app)
migrate = Migrate(app, db)
db.init_app(app)


@app.route("/")
def home():
    return {"message": "Inventorix API"}


#auth routes
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.authenticate(password):
        token = user.generate_token()
        return jsonify({"token": token, "user": user.to_dict()}), 200

    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    try:
        user = User(
            business_name=data['business_name'],
            username=data['username'],
            email=data['email']
        )
        user.password = data['password']
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/users", methods=["GET"])
@token_required
def get_user(current_user):
    return jsonify(current_user.to_dict()), 200


# categories routes
@app.route("/categories", methods=["GET"])
@token_required
def get_categories(current_user):
    categories = Category.query.filter_by(user_id=current_user.id).all()
    return jsonify([c.to_dict() for c in categories]), 200


@app.route("/categories", methods=["POST"])
@token_required
def create_category(current_user):
    data = request.get_json()
    try:
        category = Category(
            name=data['name'],
            in_stock=data.get('in_stock', True),
            user_id=current_user.id
        )
        db.session.add(category)
        db.session.commit()
        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/categories/<int:id>", methods=["GET", "PATCH", "DELETE"])
@token_required
def handle_category(current_user, id):
    category = Category.query.filter_by(id=id, user_id=current_user.id).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    if request.method == "GET":
        return jsonify(category.to_dict()), 200

    if request.method == "PATCH":
        data = request.get_json()
        try:
            for key, value in data.items():
                setattr(category, key, value)
            db.session.commit()
            return jsonify(category.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    if request.method == "DELETE":
        db.session.delete(category)
        db.session.commit()
        return "", 204

#warehouses routes
@app.route("/warehouses", methods=["GET"])
@token_required
def get_warehouses(current_user):
    warehouses = Warehouse.query.filter_by(user_id=current_user.id).all()
    return jsonify([w.to_dict() for w in warehouses]), 200


@app.route("/warehouses", methods=["POST"])
@token_required
def create_warehouse(current_user):
    data = request.get_json()
    try:
        warehouse = Warehouse(
            name=data['name'],
            location=data['location'],
            supplier=data.get('supplier', ''),
            user_id=current_user.id
        )
        db.session.add(warehouse)
        db.session.commit()
        return jsonify(warehouse.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/warehouses/<int:id>", methods=["GET", "PATCH", "DELETE"])
@token_required
def handle_warehouse(current_user, id):
    warehouse = Warehouse.query.filter_by(id=id, user_id=current_user.id).first()
    if not warehouse:
        return jsonify({"error": "Warehouse not found"}), 404

    if request.method == "GET":
        return jsonify(warehouse.to_dict()), 200

    if request.method == "PATCH":
        data = request.get_json()
        try:
            for key, value in data.items():
                setattr(warehouse, key, value)
            db.session.commit()
            return jsonify(warehouse.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    if request.method == "DELETE":
        db.session.delete(warehouse)
        db.session.commit()
        return "", 204
    
#products routes
@app.route("/products", methods=["GET"])
@token_required
def get_products(current_user):
    products = Product.query.filter_by(user_id=current_user.id).all()
    return jsonify([p.to_dict() for p in products]), 200


@app.route("/products", methods=["POST"])
@token_required
def create_product(current_user):
    data = request.get_json()
    try:
        product = Product(
            name=data["name"],
            price=data["price"],
            quantity=data.get("quantity", 0),
            category_id=data["category_id"],
            warehouse_id=data["warehouse_id"],  # ✅ direct FK now
            user_id=current_user.id
        )
        db.session.add(product)
        db.session.commit()
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/products/<int:id>", methods=["GET", "PATCH", "DELETE"])
@token_required
def handle_product(current_user, id):
    product = Product.query.filter_by(id=id, user_id=current_user.id).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if request.method == "GET":
        return jsonify(product.to_dict()), 200

    if request.method == "PATCH":
        data = request.get_json()
        try:
            for key in ["name", "price", "quantity", "category_id", "warehouse_id"]:
                if key in data:
                    setattr(product, key, data[key])
            db.session.commit()
            return jsonify(product.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    if request.method == "DELETE":
        try:
            db.session.delete(product)
            db.session.commit()
            return "", 204
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


# stats route
@app.route("/stats", methods=["GET"])
@token_required
def stats(current_user):
    return jsonify({
        "total_products": Product.query.filter_by(user_id=current_user.id).count(),
        "total_categories": Category.query.filter_by(user_id=current_user.id).count(),
        "total_warehouses": Warehouse.query.filter_by(user_id=current_user.id).count()
    }), 200


if __name__ == "__main__":
    app.run(port=5555, debug=True)
