from canvasapi import Canvas
import json
from datetime import datetime, date
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
load_dotenv()

API_URL = "https://umd.instructure.com"
API_KEY = os.getenv("CANVAS_API_KEY")

data = {}

canvas = Canvas(API_URL, API_KEY)

user = canvas.get_user('self')

def get_todo():
  out={}
  for course in user.get_courses(enrollment_state='active'):
    if "comm107" in course.name.lower() or "math240" in course.name.lower() or "math241" in course.name.lower() or "math246" in course.name.lower() or "cmsc351" in course.name.lower() or "cmsc320" in course.name.lower():
        if course not in out:
            out[course.name] = {}
        
        for item in course.get_todo_items():
            out[course.name]["assignment_name"]=item.assignment["name"]
            due_date = datetime.strptime(item.assignment["due_at"], "%Y-%m-%dT%H:%M:%SZ")
            out[course.name]["due_date"]=due_date.strftime("%B %d, %Y %I:%M %p")
  return out

# print(get_todo())