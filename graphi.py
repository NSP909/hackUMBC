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
load_dotenv()

os.environ['OPENAI_API_KEY']=os.getenv("OPENAI_API_KEY")
MODEL_ID=os.getenv("MODEL_ID")
PINECONE_API_KEY=os.getenv("PINECONE_API_KEY")

model2 = ChatOpenAI(model="gpt-4o", temperature=0)

parser = StrOutputParser()
embeddings = OpenAIEmbeddings()


pc=Pinecone(api_key=PINECONE_API_KEY)
embeddings = OpenAIEmbeddings( model="text-embedding-3-small")
index1=pc.Index("assignments")
canjson=PineconeVectorStore(index1, embeddings)
index2=pc.Index("notes")
notes=PineconeVectorStore(index2, embeddings)
index3=pc.Index("syllabi")
syllabi=PineconeVectorStore(index3, embeddings)


llm = model2


web_search_prompt="""You are an educational assistant and your job is to answer the question asked by the user based on the information scraped from a website.
    This is the question: {question}
    This is the context scraped : {context}
    
    """
context_selection_prompt="""You are an educational assistant and your job is to select the type of context that would best answer an user's question.
There are three types of context available:
1) Note and Book based context- This type of context contains information about the actual topics and concepts covered in the course. So any doubt or question that involves study material/ course content would use this
2) Syllabus based context- This type of context contains information about the syllabus of the course. So any doubt or question that involves syllabus, course structure, policies etc would use this
3) Assignment and Announcement- This type of context contains information about assignments, their due dates, announcements etc. So any doubt or question that involves assignments, announcements etc would use this

Respond with the number corresponding to the type of context you want to select for the question. For example if the question requires Note and book Based context return 1
{question}

NOTE- Only respond with the number 1, 2 or 3"""

template = """You are an educational assistant 
and your job is to answer the question asked by the user based on the context provided.

This is the question: {question} 
This is the context: {context}

"""
context_check_template="""You are an eduational relevancy checker and you need to check if a given question is related to eductaion, course content 
or any other relevant topic based on the context provided.

This is the question: {question} 
This is the context: {context}

Return 1 if you think the question is related to the context and 2 if you think the question is not related to the context.

NOTE - ONLY RESPOBD WITH 1 OR 2 AND NOTHING ELSE

"""




notes_dict = {
    "MATH246": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\MATH246.pdf",
    "MATH241": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\MATH241 Notes.pdf",
    "CMSC351": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\CMSC351 Notes.pdf",
    "COMM107": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\notes\COMM107.pdf",
    "CMSC320": r"books\datascience.pdf",
    "MATH240": r"books\linalg.pdf",
    "CMSC216": r"../extra/notes\CMSC216.pdf"
}

syllabi_dict = {
    "CMSC320": r"syallabi\CMSC320.pdf",
    "MATH240": r"syallabi\MATH240.pdf",
    "MATH241": r"syallabi\MATH241.pdf",
    "CMSC351": r"syallabi\CMSC351.pdf",
    "COMM107": r"syallabi\COMM107.pdf",
    "MATH246": r"syallabi\MATH246.pdf",
    "CMSC216": r"../extra/syllabi\CMSC216.pdf"
}
json_dict = {
    "COMM107": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\COMM107.json",
    "CMSC351": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\CMSC351.json",
    "CMSC320": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\CMSC320.json",
    "MATH241": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\MATH241.json",
    "MATH240": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\MATH240.json",
    "MATH246": r"C:\Users\sange\OneDrive\Desktop\hackUMBC\hackUMBC\canjson\MATH246.json",
    "CMSC216": r"../extra/assignments\CMSC216assignments.pdf"
}

def web_search(state):
    question=state["question"]
    url=extract_url(question)
    if url:
        context=scrape_website(url)
        output = llm.invoke(web_search_prompt.format(question=question, context=context))
        return {"answer":output.content, "webState" : 1}
    else :
        return{"webState":2}
    
def detect_course(state):
    courses = {
        "comm107": "COMM107",
        "math240": "MATH240",
        "math241": "MATH241",
        "math246": "MATH246",
        "cmsc351": "CMSC351",
        "cmsc320": "CMSC320",
        "cmsc216": "CMSC216"
    }
    question = state["question"]
    query_lower = question.lower()
    for course_key, course_value in courses.items():
        if course_key in query_lower:
            return {"Course":course_value}
    return {"Course":None}

def select_context(state):
    question = state["question"]
    selection = llm.invoke(context_selection_prompt.format(question=question))
    selection=selection.content
    print(selection)
    return {"context_type": int(selection)}

def get_note_context(state):
    question = state["question"]
    if (state["Course"] and state["Course"] in notes_dict):
        search_result = notes.similarity_search(question, k=5, filter={"source": notes_dict[state["Course"]]})
    else:
        search_result = notes.similarity_search(question, k=5)
    return {"context": search_result}

def get_syllabus_context(state):
    question = state["question"]
    if (state["Course"] and state["Course"] in syllabi_dict):
        search_result = syllabi.similarity_search(question, k=5, filter={"source": syllabi_dict[state["Course"]]})
    else:
        search_result = syllabi.similarity_search(question, k=5)
    return {"context": search_result}

def get_canjson_context(state):
    question = state["question"]
    if (state["Course"] and state["Course"] in json_dict):
        search_result = canjson.similarity_search(question, k=3, filter={"source": json_dict[state["Course"]]})
    else:
        search_result= canjson.similarity_search(question, k=3)
    return {"context": "todo list:" + str(get_todo()) + "all_course_info:"+str(search_result) }

def check_answer(state):
    question = state["question"]
    context = state["context"]
    answer = llm.invoke(context_check_template.format(context=context, question=question))
    answer=answer.content
    print(answer)
    return {"validation_type": int(answer)}
    
def generate_answer(state):
    context = state["context"]
    print(context)
    question = state["question"]
    answer = llm.invoke(template.format(context=context, question=question))
    answer=answer.content
    print(answer)
    return {"answer": answer}

def dodge_question(state):
    answer = "Sorry, I cannot help you with that question at this time. If you have any other questions, feel free to ask."
    return {"answer": answer}

class GraphState(Dict):
    question: str
    Course:str
    context_type: int
    validation_type: int
    context: str
    answer: str
    sponsor_name: str
    sponsor_type: int
    webState: int
workflow = StateGraph(GraphState)

workflow.add_node("web_search", web_search)
workflow.add_node("detect_course", detect_course)
workflow.add_node("select_context", select_context)
workflow.add_node("get_note_context", get_note_context)
workflow.add_node("get_syllabus_context", get_syllabus_context)
workflow.add_node("get_canjson_context", get_canjson_context)
workflow.add_node("check_answer", check_answer )
workflow.add_node("generate_answer", generate_answer)
workflow.add_node("dodge_question", dodge_question)

workflow.add_edge(START, "web_search")
workflow.add_conditional_edges("web_search", lambda x: x["webState"], {1: END, 2: "detect_course"})
workflow.add_edge("detect_course", "select_context")
workflow.add_conditional_edges(
    "select_context",
    lambda x: x["context_type"],
    {
        1: "get_note_context",
        2: "get_syllabus_context",
        3: "get_canjson_context"
    }
)
workflow.add_edge("get_note_context", "generate_answer")
workflow.add_edge("get_syllabus_context", "generate_answer")
workflow.add_edge("get_canjson_context", "generate_answer")
workflow.add_edge("generate_answer", "check_answer")
workflow.add_conditional_edges("check_answer",
    lambda x: x["validation_type"],
    {
        1: END,
        2: "dodge_question",
        
    })
workflow.add_edge("dodge_question", END)

graph = workflow.compile()

def run_rag_agent(question: str) -> Dict[str, Any]:
    return graph.invoke({"question": question})

if __name__ == "__main__":
    result = run_rag_agent("can you explain the different methods to solve coin changing?")
    print(result["answer"])
