import os 
from dotenv import load_dotenv
from canvasapi import Canvas
import json
from datetime import datetime, date
from bs4 import BeautifulSoup

load_dotenv()
API_URL = "https://umd.instructure.com"
API_KEY = os.getenv("CANVAS_API_KEY")

data = {}

canvas = Canvas(API_URL, API_KEY)

user = canvas.get_user('self')
data["name"] = user.name

data["courses"] = {}
courses = user.get_courses(enrollment_state='active')
for course in courses:
    if "comm107" in course.name.lower() or "math240" in course.name.lower() or "math241" in course.name.lower() or "math246" in course.name.lower() or "cmsc351" in course.name.lower() or "cmsc320" in course.name.lower():
        course_data = {}
        course_data["name"] = course.name
        course_data["assignments"] = {}
        assignments = course.get_assignments()
        for assignment in assignments:
            import requests

            assignment_data = {}
            assignment_data["name"] = assignment.name
            assignment_data["due_at"] = assignment.due_at
            assignment_data["points_possible"] = assignment.points_possible

            # Making a GET request to fetch the score
            response = requests.get(f"{API_URL}/api/v1/courses/{course.id}/assignments/{assignment.id}/submissions/self", headers={"Authorization": f"Bearer {API_KEY}"})
            if response.status_code == 200:
                submission_data = response.json()
                assignment_data["score"] = submission_data.get("score")
            else:
                assignment_data["score"] = None

            if assignment.description:
                soup = BeautifulSoup(assignment.description, "html.parser")
                assignment_data["description"] = soup.get_text(separator=' ', strip=True)
            else:
                assignment_data["description"] = None

            # Fetching announcements for the course
            course_data["announcements"] = {}
            try:
                announcements = course.get_discussion_topics(only_announcements=True)
                for announcement in announcements:
                    announcement_data = {}
                    announcement_data["title"] = announcement.title
                    announcement_data["message"] = BeautifulSoup(announcement.message, "html.parser").get_text(separator=' ', strip=True)
                    announcement_data["posted_at"] = announcement.posted_at
                    course_data["announcements"][announcement.id] = announcement_data
            except Exception as e:
                if "unauthorized" in str(e).lower():
                    pass
                else:
                    raise e

            course_data["assignments"][assignment.id] = assignment_data

        course_data["files"] = {}
        try:
            files = course.get_files()
            for file in files:
                file_data = {}
                file_data["display_name"] = file.display_name
                file_data["url"] = file.url
                course_data["files"][file.id] = file_data
            print("files recieved course: " + course.name)
        except Exception as e:
            if "unauthorized" in str(e).lower():
                pass
            else:
                raise e
        
        # Write course_data to a file named <first word of course name>.json
        file_name = course.name.split()[0][:7] + ".json"
        with open(file_name, 'w') as json_file:
            json.dump(course_data, json_file, indent=4)