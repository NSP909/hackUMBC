import csv
import random
from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
main_db = client["main"]
users_collection = main_db["users"]

def generate_fake_totals(percentage):
    total = random.randint(10, 100)
    correct = int(total * (percentage / 100))
    return correct, total

def process_csv(file_path):
    users = {}
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            user_id = row['user']
            if user_id not in users:
                users[user_id] = {
                    "_id": ObjectId(),
                    "user_id": user_id,
                    "grades": {}
                }
            
            course = row['course']
            if course not in users[user_id]['grades']:
                users[user_id]['grades'][course] = {
                    "grade": float(row['course_grade']),
                    "topics": {}
                }
            
            topic = row['course_topic']
            easy_correct, easy_total = generate_fake_totals(float(row['easy_correct']))
            medium_correct, medium_total = generate_fake_totals(float(row['medium_correct']))
            hard_correct, hard_total = generate_fake_totals(float(row['hard_correct']))
            
            users[user_id]['grades'][course]['topics'][topic] = {
                "easy_correct": easy_correct,
                "easy_total": easy_total,
                "medium_correct": medium_correct,
                "medium_total": medium_total,
                "hard_correct": hard_correct,
                "hard_total": hard_total,
                "upcoming_assignment": int(row['upcoming_assignment']),
                "days_to_deadline": float(row['days_to_deadline']) if row['days_to_deadline'] else None
            }
    
    return list(users.values())

def insert_data(users):
    for user in users:
        users_collection.insert_one(user)

if __name__ == "__main__":
    csv_file_path = '/home/aryan/hackUMBC/recommendation_training/synthetic_data.csv'  # Replace with your actual file path
    users_data = process_csv(csv_file_path)
    insert_data(users_data)
    print(f"Inserted {len(users_data)} users into the database.")