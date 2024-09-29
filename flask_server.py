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

from flask import Flask, request, jsonify
from flask_cors import CORS
from graphi import run_rag_agent
from todo import get_todo

from question import generate_question, check_answer, clear_doubt
from flask import Flask, jsonify, request
from uagents import Model
from uagents.query import query
from uagents.envelope import Envelope
import asyncio

# from custom_input_agent import PDFInputResponse
import json
import os

from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

from langchain.text_splitter import CharacterTextSplitter

from langchain_community.document_loaders import JSONLoader
import json
from pathlib import Path
from pprint import pprint
from langchain_openai import OpenAIEmbeddings

from langchain_community.document_loaders import PyPDFLoader

from bson.objectid import ObjectId
from flask import jsonify, request
from pymongo.errors import PyMongoError

embeddings = OpenAIEmbeddings()

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
main_db = client["main"]
CORS(app)

messages = []


@app.route("/create_user", methods=["POST"])
def create_user():
    user = request.json
    if not user:
        return jsonify({"error": "No JSON data provided"}), 400
    user_id = main_db["users"].insert_one(user).inserted_id
    return jsonify({"user_id": str(user_id)})


@app.route("/get_user", methods=["GET"])
def get_user():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)


@app.route("/get_analytics", methods=["GET"])
def get_grades():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user["grades"])


@app.route("/query", methods=["POST"])
def rag_endpoint():
    data = request.json
    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question' in request body"}), 400
    
    result = run_rag_agent(data["question"])
    messages.append(data["question"])
    messages.append(result["answer"])
    
    return jsonify(messages)


@app.route("/generate_question", methods=["GET"])
def api_generate_question():
    user_id = request.args.get("user_id")
    flag = request.args.get("flag", type=bool)
    course = request.args.get("course")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    user = main_db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if flag:
        course_topic = request.args.get("course_topic")
        if not course or not course_topic:
            return (
                jsonify(
                    {"error": "course and course_topic are required when flag is True"}
                ),
                400,
            )
    else:
        # Update importance for all courses and topics
        for c, course_data in user["grades"].items():
            for topic, topic_data in course_data.items():
                if topic != "grade":  # Assuming "grade" is not a topic
                    new_data = {
                        "course": [c],
                        "course_topic": [topic],
                        "course_grade": [course_data["grade"]],
                        "easy_correct": [
                            topic_data["easy_correct"] / topic_data["easy_total"]
                        ],
                        "medium_correct": [
                            topic_data["medium_correct"] / topic_data["medium_total"]
                        ],
                        "hard_correct": [
                            topic_data["hard_correct"] / topic_data["hard_total"]
                        ],
                        "upcoming_assignment": [0],  # Replace with actual data
                        "days_to_deadline": [0],  # Replace with actual data
                    }
                    predictions = recommend_study(new_data)
                    topic_data["importance"] = predictions[0]

        if course:
            # Find the most important topic within the specified course
            if course not in user["grades"]:
                return (
                    jsonify({"error": f"Course '{course}' not found for this user"}),
                    404,
                )

            most_important = max(
                (
                    (topic, data["importance"])
                    for topic, data in user["grades"][course].items()
                    if topic != "grade"
                ),
                key=lambda x: x[1],
            )
            course_topic, _ = most_important
        else:
            # Find the most important course and topic globally
            most_important = max(
                (
                    (c, topic, data["importance"])
                    for c, course_data in user["grades"].items()
                    for topic, data in course_data.items()
                    if topic != "grade"
                ),
                key=lambda x: x[2],
            )
            course, course_topic, _ = most_important

    result = generate_question(course_topic, course)
    return jsonify({"result": result, "course": course, "course_topic": course_topic})


@app.route("/check_answer", methods=["POST"])
def api_check_answer():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    required_fields = ["question", "sample", "answer", "user_id"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    question = data["question"]
    sample = data["sample"]
    answer = data["answer"]
    user_id = data["user_id"]

    # Validate question structure
    required_question_fields = ["course", "course_topic", "question_type"]
    if not all(field in question for field in required_question_fields):
        return jsonify({"error": "Invalid question structure"}), 400

    try:
        result = check_answer(question, sample, answer)

        course = question["course"]
        course_topic = question["course_topic"]
        question_type = question["question_type"]

        # Prepare the update operation
        update_operation = {
            "$inc": {f"grades.{course}.{course_topic}.{question_type}_total": 1}
        }

        # If the answer is correct, increment the correct count
        if result == "Great JOB! Your answer is correct.":
            update_operation["$inc"][
                f"grades.{course}.{course_topic}.{question_type}_correct"
            ] = 1

        # Update user grades
        update_result = main_db["users"].update_one(
            {"_id": ObjectId(user_id)}, update_operation
        )

        if update_result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"result": result})

    except PyMongoError as e:
        # Log the error here
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        # Log the error here
        return jsonify({"error": "An unexpected error occurred"}), 500


@app.route("/clear_doubt", methods=["POST"])
def api_clear_doubt():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    conversation = data.get("conversation")
    question = data.get("question")
    course = data.get("course")

    if not conversation or not question or not course:
        return jsonify({"error": "Missing conversation, question, or course"}), 400

    result = clear_doubt(conversation, question, course)
    return jsonify({"result": result})


@app.route("/todo", methods=["GET"])
def todo_endpoint():
    todo_list = get_todo()
    return jsonify(todo_list)


app.run(port=5000, debug=True)
