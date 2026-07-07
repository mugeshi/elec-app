from flask import Flask, request, jsonify
from flask_cors import CORS
from model import db, Product

app = Flask(__name__)
CORS(app)  # allow requests from your React frontend (adjust origins as needed)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


def validate_product_data(data):
    """Returns an error message string if invalid, else None."""
    if not data:
        return "No JSON body provided"
    if not data.get('name') or not str(data['name']).strip():
        return "Field 'name' is required"
    if 'price' not in data:
        return "Field 'price' is required"
    try:
        price = float(data['price'])
    except (TypeError, ValueError):
        return "Field 'price' must be a number"
    if price < 0:
        return "Field 'price' cannot be negative"
    return None


@app.route('/products', methods=['GET'])
def get_products():
    search = request.args.get('search', '').strip()
    query = Product.query
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    products = query.all()
    return jsonify([p.serialize() for p in products])


@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.serialize())


@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json(silent=True)

    error = validate_product_data(data)
    if error:
        return jsonify({'error': error}), 400

    try:
        product = Product(
            name=data['name'].strip(),
            description=data.get('description', '').strip(),
            price=float(data['price'])
        )
        db.session.add(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product', 'details': str(e)}), 500

    return jsonify(product.serialize()), 201


@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json(silent=True)

    error = validate_product_data(data)
    if error:
        return jsonify({'error': error}), 400

    try:
        product.name = data['name'].strip()
        product.description = data.get('description', '').strip()
        product.price = float(data['price'])
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product', 'details': str(e)}), 500

    return jsonify(product.serialize())


@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)

    try:
        db.session.delete(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product', 'details': str(e)}), 500

    return jsonify({'message': 'Deleted'})


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)