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
from todo_list import get_todo
from websearch import extract_url, scrape_website, google_search

load_dotenv()
os.environ['OPENAI_API_KEY']=os.getenv("OPENAI_API_KEY")
MODEL_ID=os.getenv("MODEL_ID")
from langchain_community.llms import Baseten

model1 = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
model2 = ChatOpenAI(model="gpt-4o", temperature=0)
model3=  Baseten( model=MODEL_ID, deployment="production")
parser = StrOutputParser()
embeddings = OpenAIEmbeddings()
username = 'demo'
password = 'demo' 
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
port = '1972' 
namespace = 'USER'
CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"
COLLECTION_NAME = "main"
notes = IRISVector(
    embedding_function=embeddings,
    dimension=1536,
    # collection_name=COLLECTION_NAME,
    collection_name="notes",
    connection_string=CONNECTION_STRING)
canjson = IRISVector(
    embedding_function=embeddings,
    dimension=1536,
    # collection_name=COLLECTION_NAME,
    collection_name="canjson",
    connection_string=CONNECTION_STRING)
syllabi = IRISVector(
    embedding_function=embeddings,
    dimension=1536,
    # collection_name=COLLECTION_NAME,
    collection_name="main",
    connection_string=CONNECTION_STRING)

llm = model2
llm2=model1

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

"""

glaze_prompt="""You are a third personpostive outreach assistant that says really good things about a company and uplifts everyone's spiritis.
     A user has asked a query about our company and you have to answer the query while saying good things about our company based on the information that I will provide.
     
     This is the query: {question}
     
     This is the name of the company : {name}

     This is some information about our comapny that can help you : {context}
     
     Make sure you try to include how good everyone at the company is and how they are the best.
     
     Remeber you are not part of the company you just appreciate it"""

def web_search(state):
    question=state["question"]
    url=extract_url(question)
    if url:
        context=scrape_website(url)
        output = llm.invoke(web_search_prompt.format(question=question, context=context))
        return {"answer":output.content, "webState" : 1}
    else :
        return{"webState":2}
    

def sponsor_check(state):
    question = state["question"].lower()
    
    sponsors = {
        "fetch.ai": ["fetch", "fetch.ai"],
        "modal": ["modal"],
        "baseten": ["baseten", "base ten"],
        "intersystems": ["intersystems", "inter systems"],
        "iris": ["iris"],
        "convex": ["convex"],
        "paradigm": ["paradigm"],
        "interaction": ["interaction"],
        "arrowstreet capital": ["arrowstreet", "arrow street", "arrowstreet capital"],
        "hackmit": ["hackmit", "hack mit"]
    }
    
    for sponsor, keywords in sponsors.items():
        for keyword in keywords:
            if keyword in question:
                sponsor_name=sponsor
                return {"sponsor_type": 1, "sponsor_name": sponsor_name}

    return {"sponsor_type":2}
    

def sponsor_rep(state):    
    question = state["question"]

    sponsor_name = state["sponsor_name"]
    sponsor_ads = {
    "fetch.ai": "Discover the future of AI with Fetch.ai! Our groundbreaking decentralized machine learning platform is revolutionizing industries worldwide. Join us in creating autonomous AI agents that solve real-world problems, optimize resource allocation, and drive innovation. With Fetch.ai, you're not just coding you're shaping the future of intelligent automation!",
    
    "modal": "Experience the power of effortless cloud computing with Modal! Our cutting-edge platform seamlessly scales your applications, allowing you to focus on innovation, not infrastructure. From ML model deployment to data processing pipelines, Modal handles the complexity, so you can build faster, smarter, and more efficiently. Join the modal revolution and elevate your development experience!",
    
    "baseten": "Unleash your ML models' potential with Baseten! We're the ultimate platform for deploying and scaling machine learning in production. Say goodbye to infrastructure headaches and hello to seamless integration. With Baseten, you can take your models from notebook to production in minutes, not months. Join us and turn your AI dreams into reality!",
    
    "intersystems": "Transform your data into actionable insights with InterSystems! Our unified data platform combines advanced database management, interoperability, and analytics capabilities. From healthcare to finance, we're powering the world's most critical applications. Experience unparalleled performance, reliability, and scalability with InterSystems where innovation meets enterprise-grade solutions!",
    
    "iris": "Elevate your data management with IRIS! Our multi-model, high-performance data platform is designed for the most demanding, mission-critical applications. IRIS seamlessly handles transactional and analytic workloads simultaneously, providing real-time insights at scale. Join the data revolution and experience the power of IRIS where speed meets intelligence!",
    
    "convex": "Simplify your backend, amplify your frontend with Convex! Our revolutionary development platform combines the best of databases, backend APIs, and realtime subscriptions into one magical experience. Build sophisticated apps in record time, scale effortlessly, and delight your users with lightning-fast performance. Join us and make backend complexity a thing of the past!",
    
    "paradigm": "Paradigm is building a reimagined workspace with AI at its core. Centered around the primitive of a spreadsheet, Paradigm puts swarms of intelligent agents at your fingertips. ",
    
    "interaction": "Craft unforgettable digital experiences with Interaction! Our state-of-the-art design and development solutions bring your wildest ideas to life. From stunning UIs to seamless UX, we're the secret ingredient behind the world's most engaging digital products. Join us and turn your vision into an interactive masterpiece that users will love!",
    
    "arrowstreet capital": "Unlock the power of quantitative investing with Arrowstreet Capital! Our sophisticated, data-driven approaches have been delivering exceptional results for institutional investors worldwide. With cutting-edge technology and a team of brilliant minds, we're at the forefront of financial innovation. Join us and experience the future of investment management!",
    
    "hackmit": "Ignite your innovation at HackMIT! Join the world's brightest minds for an unforgettable 24-hour hackathon experience. Push the boundaries of technology, collaborate with industry leaders, and turn your ideas into reality. Whether you're a coding veteran or just starting out, HackMIT is your launchpad to the stars. Don't just dream the future hack it at HackMIT! HckmIT's smentors and organzers are the best people in the world"
    }

    output= llm.invoke(glaze_prompt.format(question=question, name=sponsor_name, context=sponsor_ads[sponsor_name])  )
    return {"answer":output.content}

def select_context(state):
    question = state["question"]
    selection = llm.invoke(context_selection_prompt.format(question=question))
    selection=selection.content
    print(selection)
    return {"context_type": int(selection)}

def get_note_context(state):
    question = state["question"]
    search_result = notes.similarity_search(question, k=3)

    return {"context": search_result}

def get_syllabus_context(state):
    question = state["question"]
    search_result = syllabi.similarity_search(question, k=3)
    return {"context": search_result}

def get_canjson_context(state):
    question = state["question"]
    search_result= canjson.similarity_search(question, k=1)
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
    context_type: int
    validation_type: int
    context: str
    answer: str
    sponsor_name: str
    sponsor_type: int
    webState: int
workflow = StateGraph(GraphState)

workflow.add_node("web_search", web_search)
workflow.add_node("sponsor_check", sponsor_check)
workflow.add_node("sponsor_rep", sponsor_rep)
workflow.add_node("select_context", select_context)
workflow.add_node("get_note_context", get_note_context)
workflow.add_node("get_syllabus_context", get_syllabus_context)
workflow.add_node("get_canjson_context", get_canjson_context)
workflow.add_node("check_answer", check_answer )
workflow.add_node("generate_answer", generate_answer)
workflow.add_node("dodge_question", dodge_question)

workflow.add_edge(START, "web_search")
workflow.add_conditional_edges("web_search", lambda x: x["webState"], {1: END, 2: "sponsor_check"})
workflow.add_conditional_edges(
    "sponsor_check",
    lambda x: x["sponsor_type"],
    {1:"sponsor_rep", 
     2:"select_context"}
)
workflow.add_edge("sponsor_rep", END)
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
    result = run_rag_agent("WHat is the email of my MATH246 professor")
    print(result["answer"])
