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

embeddings = OpenAIEmbeddings()

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
main_db = client["main"]
CORS(app)

messages = []

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

@app.route('/query', methods=['POST'])
def rag_endpoint():
    data = request.json
    if 'question' not in data:
        return jsonify({"error": "Missing 'question' in request body"}), 400
    
    result = run_rag_agent(data['question'])
    messages.append(data['question'])
    messages.append(result['answer'])
    
    return jsonify(messages)

@app.route('/generate_question', methods=['POST'])
def api_generate_question():
    data = request.json
    query = data.get('query')
    course = data.get('course')
    
    if not query or not course:
        return jsonify({"error": "Missing query or course"}), 400
    
    result = generate_question(query, course)
    return jsonify(result)


@app.route('/check_answer', methods=['POST'])
def api_check_answer():
    data = request.json
    question = data.get('question')
    sample = data.get('sample')
    answer = data.get('answer')
    
    if not question or not sample or not answer:
        return jsonify({"error": "Missing question, sample, or answer"}), 400
    
    result = check_answer(question, sample, answer)
    return jsonify({"result": result})

@app.route('/clear_doubt', methods=['POST'])
def api_clear_doubt():
    data = request.json
    conversation = data.get('conversation')
    question = data.get('question')
    course = data.get('course')
    
    if not conversation or not question or not course:
        return jsonify({"error": "Missing conversation, question, or course"}), 400
    
    result = clear_doubt(conversation, question, course)
    return jsonify({"result": result})

@app.route('/todo', methods=['GET'])
def todo_endpoint():
    todo_list = get_todo()
    return jsonify(todo_list) 

app.run(port=5000, debug=True)