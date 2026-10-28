from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy #import SQLAlchemy to hel python work with the database
#import os to work with file paths and operating systems features
import os


#Create the Flask application
app = Flask(__name__)

#Enable CORS so the react website can send request to this backend
CORS(app)

#Configure the database connection
#SQLite will store database in a file called nivo_tronics.db
#The file will be crated in same file as app.py
#When the databse are created 
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite://" + os.path.join(BASE_DIR, "nivo_tronics.db")
)


#Disable SQLALchemy's modification tracking system
app.config["SQLACHEMY_TRACK_MODIFICATION"] =False

#Connect SQLAlchemy to Flask application
#We will use db to define tables and manage product records
db = SQLAlchemy(app)

# Create a route for the homepage of the API.
# A GET request to the "/" address will run the home() function.
@app.route("/", methods=["GET"])
def home():

    # Return a JSON response confirming that the API is running.
    return jsonify({
        "message": "Welcome to the Nivo Tronics API!",
        "status": "running"
    })


# Check whether this file is being run directly.
# If it is, start the Flask development server.
if __name__ == "__main__":

    # Run the backend on port 5000.
    # debug=True enables helpful error messages and automatic reloading
    # during development. Do not use debug mode in production.
    app.run(debug=True, port=5000)

