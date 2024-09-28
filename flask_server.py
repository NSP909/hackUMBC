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

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
main_db = client["main"]
CORS(app)

app.run(port=5000, debug=True)