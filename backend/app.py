from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["acad_hub"]
users = db["users"]

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    print(username, password, role)

    user = users.find_one({
        "username": username,
        "password": password,
        "role": role
    })

    if user:
        # return username, role, name, rollno, mobno, dob (but never return password)
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "username": user.get("username"),
                "role": user.get("role"),
                "name": user.get("name", ""),
                "rollno": user.get("rollno", ""),
                "mobno": user.get("mobno", ""),
                "dob": user.get("dob", ""),
                "image": user.get("image", "")
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

if __name__ == "__main__":
    app.run(debug=True)
