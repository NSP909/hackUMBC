import os
import ast
from langchain_community.document_loaders import PyPDFLoader, JSONLoader
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import CharacterTextSplitter
from pinecone import Pinecone
from langchain_community.vectorstores import Pinecone as Pine
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
os.environ['OPENAI_API_KEY']=os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY=os.getenv("PINECONE_API_KEY")

model2 = ChatOpenAI(model="gpt-4o", temperature=0)
parser = StrOutputParser()

pc=Pinecone(api_key=PINECONE_API_KEY)
index=pc.Index("assignments")
embeddings = OpenAIEmbeddings( model="text-embedding-3-small")
vectorstore=PineconeVectorStore(index, embeddings)

def load_data(folder_path):
    documents = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            loader = JSONLoader(
                file_path=file_path,
                jq_schema=".",
                text_content=False
            )
            #loader = PyPDFLoader(file_path)
            documents.extend(loader.load())

    text_splitter = CharacterTextSplitter(
        separator=";",
        chunk_size=400,
        chunk_overlap=150,
        length_function=len,
        is_separator_regex=False,
    )
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    index_name = "assignments"
    Pinecone = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name)
    print(Pinecone.similarity_search("Coin Changing", k=3))


def get_unique_filenames(index, top_k=10000):
    empty_vector = [0] * index.describe_index_stats()['dimension']
    
    results = index.query(vector=empty_vector, top_k=top_k, include_metadata=True)
    
    # Extract filenames from metadata
    filenames = set()
    for match in results['matches']:
        if 'source' in match['metadata']:
            filenames.add(match['metadata']['source'])
    
    return list(filenames)

# Get and print unique filenames




if __name__=="__main__":
    # load_data("canjson")
    index=pc.Index("assignments")
    unique_filenames = get_unique_filenames(index)
    print(f"Unique filenames in the index:")
    for filename in unique_filenames:
        print(filename)
    print(f"\nTotal unique files: {len(unique_filenames)}")