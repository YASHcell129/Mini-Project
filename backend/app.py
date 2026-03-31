from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["acad_hub"]
users = db["users"]
announcements = db["announcements"]


def serialize_user(user):
    created_at = user.get("createdAt")
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()

    return {
        "id": str(user.get("_id")) if user.get("_id") else "",
        "username": user.get("username"),
        "role": user.get("role"),
        "name": user.get("name", ""),
        "rollno": user.get("rollno", ""),
        "mobno": user.get("mobno", ""),
        "dob": user.get("dob", ""),
        "department": user.get("department", ""),
        "semester": user.get("semester", ""),
        "course1": user.get("course1", ""),
        "course2": user.get("course2", ""),
        "course3": user.get("course3", ""),
        "image": user.get("image", ""),
        "createdAt": created_at or ""
    }


def serialize_announcement(item):
    created_at = item.get("createdAt")
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()

    return {
        "id": str(item.get("_id")),
        "title": item.get("title", ""),
        "message": item.get("message", ""),
        "audience": item.get("audience", "All"),
        "kind": item.get("kind", "notification"),
        "pdfName": item.get("pdfName", ""),
        "pdfData": item.get("pdfData", ""),
        "createdAt": created_at or "",
        "createdBy": item.get("createdBy", "")
    }


def parse_object_id(value):
    try:
        return ObjectId(value)
    except Exception:
        return None

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
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": serialize_user(user)
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401


@app.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():
    username = request.args.get("username", "")

    try:
        admin_user = users.find_one({
            "username": username,
            "role": "Admin"
        }) if username else None

        total_students = users.count_documents({"role": "Student"})
        total_faculty = users.count_documents({"role": "Faculty"})
        total_admins = users.count_documents({"role": "Admin"})

        pending_requests = max(total_students // 12, 0)
        active_notices = max(total_faculty // 6, 0)

        return jsonify({
            "success": True,
            "admin": serialize_user(admin_user) if admin_user else None,
            "overview": [
                {"label": "Total Students", "value": str(total_students)},
                {"label": "Faculty Members", "value": str(total_faculty)},
                {"label": "Admin Accounts", "value": str(total_admins)},
                {"label": "Open Requests", "value": str(pending_requests)}
            ],
            "controls": [
                {"label": "Current Session", "value": "2025-26 Even Semester"},
                {"label": "Fee Verification Queue", "value": f"{max(total_students // 20, 1)} records pending"},
                {"label": "Pending Approvals", "value": f"{pending_requests} records need admin review"},
                {"label": "Active Notices", "value": str(active_notices)}
            ]
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/notifications", methods=["GET"])
def get_notifications():
    role = request.args.get("role", "").strip()

    if not role:
        return jsonify({
            "success": False,
            "message": "Role is required"
        }), 400

    try:
        items = list(
            announcements.find({
                "audience": {"$in": [role, "All"]}
            }).sort("createdAt", -1).limit(20)
        )

        return jsonify({
            "success": True,
            "notifications": [serialize_announcement(item) for item in items]
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/profile/image", methods=["PUT"])
def update_profile_image():
    data = request.json or {}
    username = (data.get("username") or "").strip()
    role = (data.get("role") or "").strip()
    image = data.get("image", None)

    if not username or not role:
        return jsonify({
            "success": False,
            "message": "Username and role are required"
        }), 400

    try:
        user = users.find_one({
            "username": username,
            "role": role
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        if image:
            users.update_one(
                {"_id": user["_id"]},
                {"$set": {"image": image}}
            )
        else:
            users.update_one(
                {"_id": user["_id"]},
                {"$unset": {"image": ""}}
            )

        updated_user = users.find_one({"_id": user["_id"]})
        return jsonify({
            "success": True,
            "message": "Profile image updated",
            "user": serialize_user(updated_user)
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/profile/password", methods=["PUT"])
def update_profile_password():
    data = request.json or {}
    username = (data.get("username") or "").strip()
    role = (data.get("role") or "").strip()
    current_password = (data.get("currentPassword") or "").strip()
    new_password = (data.get("newPassword") or "").strip()

    if not username or not role or not current_password or not new_password:
        return jsonify({
            "success": False,
            "message": "Username, role, current password and new password are required"
        }), 400

    if len(new_password) < 6:
        return jsonify({
            "success": False,
            "message": "New password must be at least 6 characters"
        }), 400

    try:
        user = users.find_one({
            "username": username,
            "role": role
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        if user.get("password") != current_password:
            return jsonify({
                "success": False,
                "message": "Current password is incorrect"
            }), 401

        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": new_password, "updatedAt": datetime.utcnow()}}
        )

        return jsonify({
            "success": True,
            "message": "Password updated successfully"
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/users", methods=["GET"])
def list_users():
    role = (request.args.get("role") or "").strip()
    query = {"role": role} if role else {}

    try:
        items = list(users.find(query).sort("createdAt", -1).limit(100))
        return jsonify({
            "success": True,
            "users": [serialize_user(item) for item in items]
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/users", methods=["POST"])
def create_user():
    data = request.json or {}
    name = (data.get("name") or "").strip()
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    role = (data.get("role") or "").strip()
    rollno = (data.get("rollno") or "").strip()
    mobno = (data.get("mobno") or "").strip()
    dob = (data.get("dob") or "").strip()
    department = (data.get("department") or "").strip()
    semester = (data.get("semester") or "").strip()
    course1 = (data.get("course1") or "").strip()
    course2 = (data.get("course2") or "").strip()
    course3 = (data.get("course3") or "").strip()

    if role not in {"Student", "Faculty", "Admin"}:
        return jsonify({
            "success": False,
            "message": "A valid role is required"
        }), 400

    required_fields = [name, username, password, mobno, dob]
    if not all(required_fields):
        return jsonify({
            "success": False,
            "message": "Name, username, password, mobile number and date of birth are required"
        }), 400

    if role == "Student" and not semester:
        return jsonify({
            "success": False,
            "message": "Semester is required for students"
        }), 400

    if role in {"Student", "Admin"} and not rollno:
        return jsonify({
            "success": False,
            "message": "Roll number is required for students and admins"
        }), 400

    if role == "Faculty":
        if not department:
            return jsonify({
                "success": False,
                "message": "Department is required for faculty"
            }), 400
        if not course1:
            return jsonify({
                "success": False,
                "message": "Course 1 is required for faculty"
            }), 400

    try:
        existing = users.find_one({"username": username})
        if existing:
            return jsonify({
                "success": False,
                "message": "Username already exists"
            }), 409

        document = {
            "name": name,
            "username": username,
            "password": password,
            "role": role,
            "rollno": "" if role == "Faculty" else rollno,
            "mobno": mobno,
            "dob": dob,
            "department": department,
            "semester": semester if role == "Student" else "",
            "course1": course1 if role == "Faculty" else "",
            "course2": course2 if role == "Faculty" else "",
            "course3": course3 if role == "Faculty" else "",
            "image": "",
            "createdAt": datetime.utcnow()
        }

        result = users.insert_one(document)
        document["_id"] = result.inserted_id

        return jsonify({
            "success": True,
            "message": "User created successfully",
            "user": serialize_user(document)
        }), 201
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    object_id = parse_object_id(user_id)
    if not object_id:
        return jsonify({
            "success": False,
            "message": "Invalid user id"
        }), 400

    try:
        existing = users.find_one({"_id": object_id})
        if not existing:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        users.delete_one({"_id": object_id})
        return jsonify({
            "success": True,
            "message": "User deleted successfully"
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/announcements", methods=["POST"])
def create_announcement():
    data = request.json or {}
    kind = (data.get("kind") or "notification").strip()
    audience = (data.get("audience") or "").strip()
    message = (data.get("message") or "").strip()
    title = (data.get("title") or "").strip()
    created_by = (data.get("createdBy") or "").strip()
    pdf_name = (data.get("pdfName") or "").strip()
    pdf_data = data.get("pdfData") or ""

    if kind not in {"notification", "circular"}:
        return jsonify({
            "success": False,
            "message": "Kind must be notification or circular"
        }), 400

    valid_audiences = {"Student", "Faculty", "All"} if kind == "notification" else {"Student"}
    if audience not in valid_audiences:
        return jsonify({
            "success": False,
            "message": "Invalid audience for selected announcement type"
        }), 400

    if kind == "notification" and not message:
        return jsonify({
            "success": False,
            "message": "Message is required"
        }), 400

    if kind == "circular":
        if not pdf_name.lower().endswith(".pdf") or not pdf_data:
            return jsonify({
                "success": False,
                "message": "Student circular requires a PDF upload"
            }), 400
        if not title:
            title = "Student Circular"

    try:
        document = {
            "title": title,
            "message": message,
            "audience": audience,
            "kind": kind,
            "pdfName": pdf_name,
            "pdfData": pdf_data,
            "createdBy": created_by,
            "createdAt": datetime.utcnow()
        }
        result = announcements.insert_one(document)
        document["_id"] = result.inserted_id

        return jsonify({
            "success": True,
            "message": "Announcement sent",
            "announcement": serialize_announcement(document)
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/announcements", methods=["GET"])
def list_admin_announcements():
    created_by = (request.args.get("createdBy") or "").strip()

    query = {"createdBy": created_by} if created_by else {}

    try:
        items = list(announcements.find(query).sort("createdAt", -1).limit(100))
        return jsonify({
            "success": True,
            "items": [serialize_announcement(item) for item in items]
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/announcements/<item_id>", methods=["PUT"])
def update_announcement(item_id):
    object_id = parse_object_id(item_id)
    if not object_id:
        return jsonify({
            "success": False,
            "message": "Invalid announcement id"
        }), 400

    data = request.json or {}
    kind = (data.get("kind") or "notification").strip()
    audience = (data.get("audience") or "").strip()
    message = (data.get("message") or "").strip()
    title = (data.get("title") or "").strip()
    pdf_name = (data.get("pdfName") or "").strip()
    pdf_data = data.get("pdfData") or ""

    if kind not in {"notification", "circular"}:
        return jsonify({
            "success": False,
            "message": "Kind must be notification or circular"
        }), 400

    valid_audiences = {"Student", "Faculty", "All"} if kind == "notification" else {"Student"}
    if audience not in valid_audiences:
        return jsonify({
            "success": False,
            "message": "Invalid audience for selected announcement type"
        }), 400

    if kind == "notification" and not message:
        return jsonify({
            "success": False,
            "message": "Message is required"
        }), 400

    if kind == "circular":
        if not pdf_name.lower().endswith(".pdf") or not pdf_data:
            return jsonify({
                "success": False,
                "message": "Student circular requires a PDF upload"
            }), 400
        if not title:
            title = "Student Circular"

    try:
        existing = announcements.find_one({"_id": object_id})
        if not existing:
            return jsonify({
                "success": False,
                "message": "Announcement not found"
            }), 404

        announcements.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "kind": kind,
                    "audience": audience,
                    "title": title,
                    "message": message,
                    "pdfName": pdf_name,
                    "pdfData": pdf_data,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        updated = announcements.find_one({"_id": object_id})
        return jsonify({
            "success": True,
            "item": serialize_announcement(updated)
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500


@app.route("/admin/announcements/<item_id>", methods=["DELETE"])
def delete_announcement(item_id):
    object_id = parse_object_id(item_id)
    if not object_id:
        return jsonify({
            "success": False,
            "message": "Invalid announcement id"
        }), 400

    try:
        result = announcements.delete_one({"_id": object_id})
        if result.deleted_count == 0:
            return jsonify({
                "success": False,
                "message": "Announcement not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Announcement deleted"
        })
    except PyMongoError as exc:
        return jsonify({
            "success": False,
            "message": f"Database error: {exc}"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
