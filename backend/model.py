#import the database connection from app.py
from app import db

#Define the product model
#This modeeldescribe the columns in our products database table.
class product(db.Model):

    #Give the table a name in the database
    __tablename__="products"

    #Unique ID for every product
    id = db.Column(db.Integer, primary_key=True)

    #Name of the phone or other product
    name = db.Column(db.String(150), nullable=False)

    # Product brand, for example Apple or Samsung.
    brand = db.Column(db.String(100), nullable=False)

    # Storage capacity, for example 128GB or 256GB.
    storage = db.Column(db.String(50), nullable=True)

    # Price of the product in Kenyan shillings.
    price = db.Column(db.Float, nullable=False)

    # Number of units available in stock.
    stock = db.Column(db.Integer, default=0, nullable=False)

    # Optional description of the product.
    description = db.Column(db.Text, nullable=True)

    # Optional image path or image URL.
    image = db.Column(db.String(255), nullable=True)

    # Return the product name when the object is printed.
    def __repr__(self):
        return f"<Product {self.name}>"