from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
import os
import pickle

app = Flask(__name__)

CORS(app)

# Path to store the vector store
vectorstore_dir = 'vectorstore_db'

# Function to create and load the vector store
def create_vectorstore(splits):
    embeddings = OllamaEmbeddings(model="llama3.2:1b")
    # Create the vectorstore and persist it automatically
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=vectorstore_dir)
    return vectorstore

# Load or create the vector store
if os.path.exists(vectorstore_dir):
    # If the vectorstore exists, it is loaded automatically by Chroma
    vectorstore = Chroma(persist_directory=vectorstore_dir, embedding_function=OllamaEmbeddings(model="llama3.2:1b"))
else:
    # If the vectorstore does not exist, create a new one
    loader = PDFPlumberLoader("../arduino.pdf")
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    
    vectorstore = create_vectorstore(splits)

# Setup for RAG
def combine_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def ollama_llm(question, context):
    formatted_prompt = f"Question: {question}\n\nContext: {context}"
    response = ollama.chat(model='llama3.2:1b', messages=[{'role': 'user', 'content': formatted_prompt}])
    return response['message']['content']

def rag_chain(question):
    retriever = vectorstore.as_retriever()
    retrieved_docs = retriever.invoke(question)
    formatted_context = combine_docs(retrieved_docs)
    return ollama_llm(question, formatted_context)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    question = data.get("question")
    answer = rag_chain(question)
    print(answer)
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True)
