from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

# Creating the Flask Application
app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///product.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/products', methods=['GET'])
def get_product():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products])

if __name__ == '__main__':
    app.run(debug=True)





