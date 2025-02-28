import ollama
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings


# 1. Load the data
loader = PDFPlumberLoader("arduino.pdf")
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"Split {len(docs)} documents into {len(splits)} chunks.")


# 2. Create Ollama embeddings and vector store
embeddings = OllamaEmbeddings(model="llama3.2:1b")
vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
print("Done embeddings!!")

# 3. Call Ollama Llama3 model
def ollama_llm(question, context):
    formatted_prompt = f"Question: {question}\n\nContext: {context}"
    print(question, context)
    response = ollama.chat(model='llama3.2:1b', messages=[{'role': 'user', 'content': formatted_prompt}])
    return response['message']['content']

# 4. RAG Setup
retriever = vectorstore.as_retriever()
print("Start setting up RAG!!")
def combine_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)
def rag_chain(question):
    retrieved_docs = retriever.invoke(question)
    formatted_context = combine_docs(retrieved_docs)
    return ollama_llm(question, formatted_context)

# 5. Use the RAG App
# result = rag_chain("Who wrote arduino projects book?")
# print(result)
try:
    while True:
        # Prompt the user for input
        user_input = input("Ask a question: ")
        print(f"User input received: {user_input}\n\n")

        # Call the rag_chain function with the user input
        result = rag_chain(user_input)

        # Print the result
        print(result)

except KeyboardInterrupt:
    print("\nProgram terminated by user.")



# # Load and split documents
# loader = PDFPlumberLoader("../arduino.pdf")
# docs = loader.load()
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
# splits = text_splitter.split_documents(docs)

# # Create Ollama embeddings and vector store
# embeddings = OllamaEmbeddings(model="llama3.2:1b")
# vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)