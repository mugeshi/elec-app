from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255))          # URL or path to product image
    category = db.Column(db.String(50))        # e.g. "phones", "laptops", "accessories"
    brand = db.Column(db.String(50))           # e.g. "apple", "samsung" — matches your dropdown
    stock = db.Column(db.Integer, default=0)   # inventory count
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'category': self.category,
            'brand': self.brand,
            'stock': self.stock,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }