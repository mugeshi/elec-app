from flask import Flask, request, jsonify
from model import db, Product

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/products', methods=['GET'])
def get_products():
    return jsonify([p.serialize() for p in Product.query.all()])


@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()

    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price']
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.serialize()), 201


@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    product.name = data['name']
    product.description = data.get('description', '')
    product.price = data['price']

    db.session.commit()

    return jsonify(product.serialize())


@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Deleted'})


if __name__ == '__main__':
    app.run(debug=True)




