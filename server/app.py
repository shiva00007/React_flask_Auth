from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import ApplicationConfig
from models import db, User

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/current_user")

def get_current_user():
    user_id = session.get("user_id")

    #check the user
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "username": user.username,
        "email": user.email
    }) 

@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if email format is valid
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400
    #check the user is Present
    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
       "message" : "Register Succesfully"
    }),200


@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    #to check the email was correct
    
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "User with this email does not exist"}), 404
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401 
    
    session["user_id"] = user.id

    return jsonify({
       "message" : "Login Succesfully"
    }),200

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "Logged out successfully"

if __name__ == "__main__":
    app.run(debug=True)
