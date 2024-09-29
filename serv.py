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
CORS(app)

messages = []

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

if __name__ == '__main__':
    app.run(debug=True, port=8000)