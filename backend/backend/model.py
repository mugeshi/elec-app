from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Product(db.Model):
    id = db.colum(db.integer, primary_key=True)
    name= db.column(db.String(80),nullable=False)
    description = db.column(db.String(200))
    price = db.column(db.Float, nullable=False)

    def serialize(self):
      return{
        'id': self.id,
        'name': self.name,
        'description': self.description,
        'price': self.price
    } 