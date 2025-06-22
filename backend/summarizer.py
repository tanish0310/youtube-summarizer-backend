from langchain_community.llms import Ollama
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

def summarize_text(text: str) -> str:
    llm = Ollama(model="llama3")  # Must have llama3 pulled
    chain = load_summarize_chain(llm, chain_type="stuff")

    docs = [Document(page_content=text)]
    summary = chain.run(docs)
    return summary

