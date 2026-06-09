from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

#Creating the Flask Application
app = Flask(__name__)

#Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///product.db'
app.config['SQLACHEMY_TRACK_MODIFICATION'] =False

#initialize the databse with the app
db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()





