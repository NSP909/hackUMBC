from flask import Flask, request, jsonify
from flask_cors import CORS
from gaph import run_rag_agent
from todo_list import get_todo
from gmail_agent import send_email as send_dat_email

from flask import Flask, jsonify, request
from uagents import Model
from uagents.query import query
from uagents.envelope import Envelope
import asyncio
# from custom_input_agent import PDFInputResponse
import json
from gmail_agent import EmailRequest, EditRequest, EmailConfirmation
import os

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
from langchain_iris import IRISVector

# loader =PyPDFLoader("syallabi\MATH246.pdf")
# # documents= loader.load()
# # text_splitter = CharacterTextSplitter(chunk_size=400, chunk_overlap=20)
# docs = text_splitter.split_documents(documents)

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

@app.route('/todo', methods=['GET'])
def todo_endpoint():
    todo_list = get_todo()
    return jsonify(todo_list) 


# Define the address of your agent
AGENT_ADDRESS = "agent1qd9m7gwn5ankrvlvdqkxyf6mnsxd6yvhf3xgrj97gv0fjjavj263qt890sm"
EMAIL_AGENT_ADDRESS = "agent1qv9hk62657mx0429je92hltn48vrq3uwdghd20a9l69pzqclp7qhkc6hf8n"
username = 'demo'
password = 'demo' 
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
port = '1972' 
namespace = 'USER'
CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"    
# Define data model for incoming requests
class PDFProcessRequest(Model):
    pdf_path: str
    image_dir: str

class TestResponse(Model):
    response: str

@app.route("/draft_email", methods=["POST"])
async def draft_email():
    request_data = request.get_json()
    email = request_data['email_to']
    course_number = request_data['course_number']
    prompt = request_data['prompt']

    print(f"Email: {email}")
    print(f"Prompt: {prompt}")

    response = await query(destination = EMAIL_AGENT_ADDRESS, message = EmailRequest(prompt = prompt, course_number = course_number, recipient_email = email),timeout = 15.0)

    if response.status == "delivered":
        temp_json_path = "temp_email_data.json"
        try:
            with open(temp_json_path, 'r') as temp_json_file:
                data = json.load(temp_json_file)
            os.remove(temp_json_path)
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)})

    # response = json.loads(response.decode_payload())
    # return data

@app.route("/process_pdf", methods=["POST"])
async def process_pdf():
    
    pdf = request.files['pdf']
    #save the pdf to a specific path
    pdf_path = "temp.pdf"
    pdf.save(pdf_path)

    pdf_path = "temp.pdf"
    img_path = "sample_imgs/"
    print(f"PDF Path: {pdf_path}")
    print(f"Image Path: {img_path}")

    response = await query(destination = AGENT_ADDRESS, message = PDFProcessRequest(pdf_path = pdf_path, image_dir = img_path),timeout = 15.0)
    print(response)
    if response.status == "delivered":
        temp_json_path = "temp_data.json"
        try:
            with open(temp_json_path, 'r') as temp_json_file:
                data = json.load(temp_json_file)
            os.remove(temp_json_path)
            x = jsonify(data)
           
            documents= x["ocr_results"]+" "+x["text_content"]
            text_splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=50)
            data= text_splitter.split_documents(documents)
            
            # db = IRISVector.from_documents(
            # embedding=embeddings,
            # documents=data,
            # collection_name=COLLECTION_NAME,
            # connection_string=CONNECTION_STRING,
            # )
            db = IRISVector(
            embedding_function=embeddings,
            dimension=1536,
            collection_name="notes",
            connection_string=CONNECTION_STRING,
            )
            db.add_documents(data)
            print("done")
            return x
        except Exception as e:
            return jsonify({"error": str(e)})

    # response = json.loads(response.decode_payload())
    # return data

@app.route("/edit_email", methods=["POST"])
async def edit_email():
    request_data = request.get_json()
    email = request_data['email_to']
    prompt = request_data['prompt']
    draft = request_data['draft']
    subject = request_data['subject']

    print(f"Draft: {draft}")
    print(f"Prompt: {prompt}")

    response = await query(destination = EMAIL_AGENT_ADDRESS, message = EditRequest(prompt = prompt, content = draft, recipient_email = email, subject = subject),timeout = 15.0)

    if response.status == "delivered":
        temp_json_path = "temp_email_data.json"
        try:
            with open(temp_json_path, 'r') as temp_json_file:
                data = json.load(temp_json_file)
            os.remove(temp_json_path)
            response = query(destination = EMAIL_AGENT_ADDRESS, message = EmailConfirmation(content= data["content"], recipient_email=email, subject=data["subject"]),timeout = 15.0)
            if response.status == "delivered":
                return jsonify({"status": "Email sent successfully", "data":data})
        except Exception as e:
            return jsonify({"error": str(e)})

@app.route("/send_email", methods=["POST"])
async def send_email():
    request_data = request.get_json()
    email = request_data['email_to']
    subject = request_data['subject']
    draft = request_data['draft']

    print(f"Draft: {draft}")
    print(f"Subject: {subject}")
    send_dat_email(email, subject, draft)
    # response = query(destination = EMAIL_AGENT_ADDRESS, message = EmailConfirmation(content= draft, recipient_email=email, subject=subject),timeout = 15.0)

    # if response.status == "delivered":
    return jsonify({"status": "Email sent successfully"})
    # else:
    #     return jsonify({"status": "Failed to send email"})

    # response = json.loads(response.decode_payload())
    # return data


if __name__ == '__main__':
    app.run(debug=True, port=8000)