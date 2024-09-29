import torch
import torch.nn as nn
import joblib
import pandas as pd

class StudyRecommenderModel(nn.Module):
    def __init__(self, n_courses, n_topics, emb_dim, hidden_size):
        super(StudyRecommenderModel, self).__init__()

        self.course_embedding = nn.Embedding(n_courses, emb_dim)
        self.topic_embedding = nn.Embedding(n_topics, emb_dim)

        self.fc1 = nn.Linear(emb_dim * 2 + 6, hidden_size)
        self.fc2 = nn.Linear(hidden_size, 32)
        self.fc3 = nn.Linear(32, 1)

    def forward(self, course, topic, features):
        course_emb = self.course_embedding(course)
        topic_emb = self.topic_embedding(topic)

        x = torch.cat([course_emb, topic_emb, features], dim=1)

        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = torch.sigmoid(self.fc3(x))

        return x
    

model = StudyRecommenderModel(6, 146, 32, 64)
model.load_state_dict(torch.load(r'D:\Projects\hackUMBC\recommendation_training\model.pth'))
model.eval()
course_encoder = joblib.load(r'D:\Projects\hackUMBC\recommendation_training\course_encoder.pkl')
topic_encoder = joblib.load(r'D:\Projects\hackUMBC\recommendation_training\topic_encoder.pkl')
scaler = joblib.load(r'D:\Projects\hackUMBC\recommendation_training\scaler.pkl')

def recommend_study(new_data, scaler):
    new_data['course'] = course_encoder.transform(new_data['course'])
    new_data['course_topic'] = topic_encoder.transform(new_data['course_topic'])

    new_data[['course_grade', 'easy_correct', 'medium_correct', 'hard_correct', 'days_to_deadline']] = scaler.transform(
        new_data[['course_grade', 'easy_correct', 'medium_correct', 'hard_correct', 'days_to_deadline']].fillna(0)
    )

    course_tensor = torch.tensor(new_data['course'].values, dtype=torch.long)
    topic_tensor = torch.tensor(new_data['course_topic'].values, dtype=torch.long)
    features_tensor = torch.tensor(new_data[['course_grade', 'easy_correct', 'medium_correct', 'hard_correct', 'upcoming_assignment', 'days_to_deadline']].values, dtype=torch.float)

    model.eval()
    with torch.no_grad():
        predictions = model(course_tensor, topic_tensor, features_tensor)
    
    return predictions.squeeze().numpy()


# new_data = pd.DataFrame({
#     'course': ['CMSC351'],  # Replace with actual course names
#     'course_topic': ['Spanning Trees'],  # Replace with actual course topics
#     'course_grade': [85.0],
#     'easy_correct': [95.0],
#     'medium_correct': [90.0],
#     'hard_correct': [85.0],
#     'upcoming_assignment': [1],
#     'days_to_deadline': [0.8]
# })

# # Call the inference function
# predictions = recommend_study(new_data, scaler)

# print("Predicted importance:", predictions)