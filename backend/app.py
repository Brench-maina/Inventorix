from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User, Product, Category, Warehouse

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventorix.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

CORS(app)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

class Home(Resource):
    def get(self):
        return {'message': 'Inventorix API'}

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.authenticate(password):
            return make_response(jsonify({
                'id': user.id,
                'username': user.username,
                'business_name': user.business_name,
                'email': user.email
            }), 200)
        else:
            return make_response(jsonify({'error': 'Invalid credentials'}), 401)

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    
    def post(self):
        data = request.get_json()
        try:
            user = User(
                business_name=data['business_name'],
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            db.session.add(user)
            db.session.commit()
            return make_response(jsonify(user.to_dict()), 201)
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

class Categories(Resource):
    def get(self):
        categories = [category.to_dict() for category in Category.query.all()]
        return make_response(jsonify(categories), 200)
    
    def post(self):
        data = request.get_json()
        try:
            category = Category(
                name=data['name'],
                in_stock=data.get('in_stock', True)
            )
            db.session.add(category)
            db.session.commit()
            return make_response(jsonify(category.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 400)

class Warehouses(Resource):
    def get(self):
        warehouses = [warehouse.to_dict() for warehouse in Warehouse.query.all()]
        return make_response(jsonify(warehouses), 200)
    
    def post(self):
        data = request.get_json()
        try:
            warehouse = Warehouse(
                name=data['name'],
                location=data['location'],
                supplier=data.get('supplier', '')
            )
            db.session.add(warehouse)
            db.session.commit()
            return make_response(jsonify(warehouse.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 400)

class Products(Resource):
    def get(self):
        products = [product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)
    
    def post(self):
        data = request.get_json()
        try:
            product = Product(
                name=data['name'],
                price=data['price'],
                quantity=data['quantity'],
                category_id=data['category_id'],
                warehouse_id=data['warehouse_id'],
                user_id=data['user_id']
            )
            db.session.add(product)
            db.session.commit()
            return make_response(jsonify(product.to_dict()), 201)
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

class ProductsById(Resource):
    def get(self, id):
        product = Product.query.get(id)
        if product:
            return make_response(jsonify(product.to_dict()), 200)
        return make_response(jsonify({'error': 'Product not found'}), 404)
    
    def patch(self, id):
        product = Product.query.get(id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)
        
        data = request.get_json()
        try:
            for attr in data:
                setattr(product, attr, data[attr])
            db.session.commit()
            return make_response(jsonify(product.to_dict()), 200)
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)
    
    def delete(self, id):
        product = Product.query.get(id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)
        
        db.session.delete(product)
        db.session.commit()
        return make_response('', 204)

class Stats(Resource):
    def get(self):
        total_products = Product.query.count()
        total_categories = Category.query.count()
        total_warehouses = Warehouse.query.count()
        
        return make_response(jsonify({
            'total_products': total_products,
            'total_categories': total_categories,
            'total_warehouses': total_warehouses
        }), 200)

# Add routes
api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(Users, '/users')
api.add_resource(Categories, '/categories')
api.add_resource(Warehouses, '/warehouses')
api.add_resource(Products, '/products')
api.add_resource(ProductsById, '/products/<int:id>')
api.add_resource(Stats, '/stats')

if __name__ == '__main__':
    app.run(port=5555, debug=True)