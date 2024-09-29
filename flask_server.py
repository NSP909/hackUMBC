from flask import Flask
from flask import request
from flask import jsonify
from pymongo import MongoClient
from datetime import datetime
import base64
from flask_cors import CORS, cross_origin
from bson.objectid import ObjectId
import requests
import os
from collections import defaultdict
from recommendation_training.rec import recommend_study

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
main_db = client["main"]
CORS(app)

@app.route(('/create_user'), methods=['POST'])
def create_user():
    data = request.get_json()
    user = data['user']
    user_id = main_db["users"].insert_one(user).inserted_id
    return jsonify({"user_id": str(user_id)})

@app.route(('/get_user'), methods=['POST'])
def get_user():
    data = request.get_json()
    user_id = data['user_id']
    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    return jsonify(user)

@app.route(('/get_grades'), methods=['POST'])
def get_grades():
    data = request.get_json()
    user_id = data['user_id']
    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    return jsonify(user['grades'])

@app.route(('/update_grades'), methods=['POST'])
def update_grades():
    data = request.get_json()
    user_id = data['user_id']
    grades = data['grades']
    main_db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"grades": grades}})
    return jsonify({"status": "success"})

@app.route(('/generate_recommendations'), methods=['GET'])
def get_top_recommendations():
    data = request.get_json()
    user_id = data['user_id']
    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    for course in user['grades']:
        upcoming_assignments = 0 # Replace with actual number of upcoming assignments
        days_to_deadline = 0 # Replace with actual days to deadline
        for course_topic in user['grades'][course]:
            new_data = {
                'course': [course],
                'course_topic': [course_topic],
                'course_grade': [user['grades'][course]['grade']],
                'easy_correct': [user['grades'][course][course_topic]['easy_correct']],
                'medium_correct': [user['grades'][course][course_topic]['medium_correct']],
                'hard_correct': [user['grades'][course][course_topic]['hard_correct']],
                'upcoming_assignment': [upcoming_assignments],
                'days_to_deadline': [days_to_deadline]
            }
            predictions = recommend_study(new_data)
            user['grades'][course][course_topic]['importance'] = predictions[0]

    return jsonify(user['grades'])

@app.route(('/update_practice'), methods=['POST'])
def update_practice():
    data = request.get_json()
    user_id = data['user_id']
    course = data['course']
    course_topic = data['course_topic']
    main_db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"grades."+course+"."+course_topic+".importance": 0}})
    return jsonify({"status": "success"})

app.run(port=5000, debug=True)