import requests
import os
import json

# test for the following function:
# @app.route("/get_analytics", methods=["GET"])
# def get_grades():
#     user_id = request.args.get("user_id")
#     if not user_id:
#         return jsonify({"error": "user_id is required"}), 400
#     user = main_db["users"].find_one({"user_id": user_id})
#     if not user:
#         return jsonify({"error": "User not found"}), 404
#     return jsonify(user["grades"])

# request = requests.get("http://localhost:5000/generate_question?user_id=1&flag=True&course=CMSC351&course_topic=Maximum Contiguous Sum")

# print(request.json())

# @app.route("/query", methods=["POST"])
# def rag_endpoint():
#     data = request.json
#     if not data or "question" not in data:
#         return jsonify({"error": "Missing 'question' in request body"}), 400

#     result = run_rag_agent(data["question"])
#     messages.append(data["question"])
#     messages.append(result["answer"])

#     return jsonify(messages)

# test for the following function:


# request = requests.post("http://localhost:5000/query", json={"question":"What is the time complexity of finding the maximum contiguous sum?"})
# print(request.json())

# {'course': 'CMSC351', 'course_topic': 'Maximum Contiguous Sum', 'result': {'difficulty': 'Easy', 'question': {'Answer': 'The brute force method for finding the maximum contiguous sum involves checking the sum of every possible sublist of the given list of integers and keeping track of the maximum sum found. This method has a high time complexity as it requires examining all possible sublists.', 'Question': 'What is the brute force method for finding the maximum contiguous sum in a list of integers?'}, 'type': 'Written'}}
# based on the output above, call the following function:

# @app.route("/check_answer", methods=["POST"])
# def api_check_answer():
#     data = request.json
#     if not data:
#         return jsonify({"error": "No JSON data provided"}), 400

#     required_fields = ["question", "sample", "answer", "user_id"]
#     if not all(field in data for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     question = data["question"]
#     sample = data["sample"]
#     answer = data["answer"]
#     user_id = data["user_id"]

#     # Validate question structure
#     required_question_fields = ["course", "course_topic", "question_type"]
#     if not all(field in question for field in required_question_fields):
#         return jsonify({"error": "Invalid question structure"}), 400

#     try:
#         result = check_answer(question, sample, answer)

#         course = question["course"]
#         course_topic = question["course_topic"]
#         question_type = question["question_type"]

#         # Prepare the update operation
#         update_operation = {
#             "$inc": {f"grades.{course}.topics.{course_topic}.{question_type}_total": 1}
#         }

#         # If the answer is correct, increment the correct count
#         if result == "Great JOB! Your answer is correct.":
#             update_operation["$inc"][
#                 f"grades.{course}.topics.{course_topic}.{question_type}_correct"
#             ] = 1

#         # Update user grades
#         update_result = main_db["users"].update_one(
#             {"user_id": user_id}, update_operation
#         )

#         if update_result.matched_count == 0:
#             return jsonify({"error": "User not found"}), 404

#         return jsonify({"result": result})

#     except Exception as e:
#         # Log the error here
#         return jsonify({"error": "An unexpected error occurred"}), 500

# requests = requests.get("http://localhost:5000/todo")

# print(requests.json())

# @app.route("/clear_doubt", methods=["POST"])
# def api_clear_doubt():
#     data = request.json
#     if not data:
#         return jsonify({"error": "No JSON data provided"}), 400

#     conversation = data.get("conversation")
#     question = data.get("question")
#     course = data.get("course")

#     if not conversation or not question or not course:
#         return jsonify({"error": "Missing conversation, question, or course"}), 400

#     result = clear_doubt(conversation, question, course)
#     return jsonify({"result": result})

# request = requests.post(
#     "http://localhost:5000/clear_doubt",
#     json={"conversation": "I am having trouble understanding the concept of Maximum Contiguous Sum", "question": "What is the time complexity of finding the maximum contiguous sum?", "course": "CMSC351"}
# )

# print(request.json())

# @app.route("/get_user", methods=["GET"])
# def get_user():
#     user_id = request.args.get("user_id")
#     if not user_id:
#         return jsonify({"error": "user_id is required"}), 400
#     user = main_db["users"].find_one({"user_id": user_id})
#     if not user:
#         return jsonify({"error": "User not found"}), 404
#     return jsonify(user)

# request = requests.get("http://localhost:5000/get_user?user_id=1")
# print(request.json())

# @app.route("/create_user", methods=["POST"])
# def create_user():
#     user = request.json
#     if not user:
#         return jsonify({"error": "No JSON data provided"}), 400
#     user_id = main_db["users"].insert_one(user).inserted_id
#     return jsonify({"user_id": str(user_id)})

request = requests.post(
    "http://localhost:5000/create_user",
    json={"user_id": "999", "grades": {}}
)

print(request.json())