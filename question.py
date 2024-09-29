from langchain.tools.retriever import create_retriever_tool
import os
import ast
from dotenv import load_dotenv
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import Pinecone as Pine
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.llms import Baseten
import argparse
from typing import List, Dict, Any
from langchain.prompts import ChatPromptTemplate
from langchain.schema import Document
from langchain_core.runnables import RunnablePassthrough
from langgraph.graph import StateGraph, END, START
from langchain_iris import IRISVector
from todo import get_todo
from websearch import extract_url, scrape_website, google_search
from langchain_community.vectorstores import Pinecone as Pine
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
import ast
import random

load_dotenv()

os.environ['OPENAI_API_KEY']=os.getenv("OPENAI_API_KEY")
MODEL_ID=os.getenv("MODEL_ID")
PINECONE_API_KEY=os.getenv("PINECONE_API_KEY")
model1 = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
model2 = ChatOpenAI(model="gpt-4o", temperature=0)
model3=  Baseten( model=MODEL_ID, deployment="production")
parser = StrOutputParser()
embeddings = OpenAIEmbeddings()


pc=Pinecone(api_key=PINECONE_API_KEY)
embeddings = OpenAIEmbeddings( model="text-embedding-3-small")

index2=pc.Index("notes")
notes=PineconeVectorStore(index2, embeddings)



llm = model2
llm2=model1

question_type_prompt="""You are a teaching assistant and you are helping me prepare questions for an exam.
Your job is to determmine what type of question would better suit a particular topic based on the context provided.

This is the Topic: {topic}
This is the context scraped : {context}

If you think it woulld be better to ask a multiple choice question, return 1.
If you think it would be better to ask a subjective question, return 2.

Do not return anything other than 1 or 2.

"""

generate_question_prompt="""You are a tutor and your job is to generate multiple choice questions based on the given topic and given context.

    This is the Topic: {topic}
    This is the context scraped : {context}
    
    You need to return ouput in the following format:
    "{{"Question": "What is the capital of France?", "Options": ["Paris", "London", "Berlin", "Madrid"], "Answer": "Paris"}}"
    
    The question needs to be {typ}
    
    Do not return anything other than the dictionary.
    """

generate_sub_question_prompt="""You are a tutor and your job is to generate free response questions based on the given topic and given context.

    This is the Topic: {topic}
    This is the context scraped : {context}
    
    You need to return ouput in the following format:
    "{{"Question": "What is photosynthesis?",
      "Answer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."}}"
    
    The question needs to be {typ}

    Do not return anything other than the dictionary.
    """


check_answer_template="""You are an academic grader and your job is to determine if the user's answer is correct or not. 
You will be provided the orginal question, an appropriate sample answer and the user's answer.

This is the question: {question} 
This is the the sample answer: {sample}
This is the user's answer: {answer}

You have to be strict and even a small mistake or partial answer will be considered incorrect.

Return 1 if you think the answer is correct and 2 if you think the answer is incorrect.

"""

respond_to_query_template="""You are an educational assistant and the user just answered a question incorrectly.
Your job is to explain  to them  why their answer is incorrect and provide them with the correct answer.

This is the question: {question}
this is the user's answer: {answer}
This is a sample answer: {sample_answer}

Always start out by saying something like sorry you got the answer wrong or oops you have the wrong answer.
If the user's answer is partially correct, you can point out the correct part and then provide the correct answer.
Be polite and encouraging as you want the student to succeed.

"""

clear_doubt_prompt="""You are an educational assistant and you are helping clear a doubt for a student.
Your job is to answer their question based on the conversation you have had with them so far and the context provided from the knowledge base.

This has been the conversation so far: {conversation}

This is the context scraped : {context}

This is the doubt: {question}
"""

notes_dict = {
    "MATH246": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\MATH246.pdf",
    "MATH241": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\MATH241 Notes.pdf",
    "CMSC351": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\CMSC351 Notes.pdf",
    "COMM107": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\COMM107.pdf"
}
    
def detect_course(course):
    courses = {
        "comm107": "COMM107",
        "math240": "MATH240",
        "math241": "MATH241",
        "math246": "MATH246",
        "cmsc351": "CMSC351",
        "cmsc320": "CMSC320"
    }
    query_lower = course.lower()
    if query_lower in courses:
        return notes_dict[courses[query_lower]]
    return None

def generate_question(query, course):
    prompt=ChatPromptTemplate.from_template(question_type_prompt)
    chain = prompt | llm| parser
    cour = detect_course(course)
    if cour:
        context=notes.similarity_search(query, k=5, filter={"source":cour})
    else:
        context=google_search(query)  
    response=chain.invoke({"topic":query, "context":context})
    di={1:"Easy", 2 :"Medium", 3:"Hard"}
    typ = random.randint(1, 3)
    if int(response)==1:
        return {"question": ast.literal_eval(execute_mcq(query, course, di[typ])), "type":"MCQ", "difficulty":di[typ]}
    else:
        return {"question": ast.literal_eval(execute_subjective(query, course, di[typ])), "type":"Written", "difficulty":di[typ]}

def execute_mcq(query, course, typ):
    prompt=ChatPromptTemplate.from_template(generate_question_prompt)
    chain = prompt | llm| parser
    cour = detect_course(course)
    if cour:
        context=notes.similarity_search(query, k=5, filter={"source":cour})
    else:
        context=google_search(query)  
    response=chain.invoke({"topic":query,"context":context, "type":typ})
    return response

def execute_subjective(query, course, typ):
    prompt=ChatPromptTemplate.from_template(generate_sub_question_prompt)
    chain = prompt | llm| parser
    cour = detect_course(course)
    if cour:
        context=notes.similarity_search(query, k=5, filter={"source":cour})
    else:
        context=google_search(query)  
    response=chain.invoke({"topic":query,"context":context, "type":typ})
    return response
    
def check_answer(question, sample, answer):
    prompt=ChatPromptTemplate.from_template(check_answer_template)
    chain = prompt | llm| parser
    response=chain.invoke({"question":question, "sample":sample, "answer":answer})
    if int(response)==1:
        return "Great JOB! Your answer is correct."
    else:
        prompt2=ChatPromptTemplate.from_template(respond_to_query_template)
        chain2 = prompt2 | llm| parser
        return chain2.invoke({"question":question, "answer":answer, "sample_answer":sample})
    
def clear_doubt(conversation, question, course):
    prompt=ChatPromptTemplate.from_template(clear_doubt_prompt)
    chain = prompt | llm| parser
    cour = detect_course(course)
    context=notes.similarity_search(conversation, k=5, filters={"source":cour})
    response=chain.invoke({"conversation":conversation, "context":context, "question":question})
    return response

if __name__ == "__main__":
    result = check_answer("Explain the role of chlorophyll in the process of photosynthesis.", 
                               "Chlorophyll is a pigment found in the chloroplasts of green plants and some other organisms. It plays a crucial role in photosynthesis by absorbing light energy, usually from the sun, and converting it into chemical energy. This energy is then used to convert carbon dioxide and water into glucose and oxygen.",
                               "car go boom")
    print(result)
