from fastapi import FastAPI
from retriever import retrieve
from prompts import build_prompt
from utils import check_red_flags, add_safety
import google.generativeai as genai

genai.configure(api_key="")

app = FastAPI()

@app.post("/chat")
def chat(user_query: str):
    if check_red_flags(user_query):
        return {"answer": "⚠️ Your symptoms may be urgent. Please seek medical attention immediately."}
    
    chunks = retrieve(user_query)
    prompt = build_prompt(user_query, chunks)
    resp = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)
    answer = add_safety(resp.text)
    return {"answer": answer}

@app.post("/chat-with-classifier")
def chat_with_classifier(user_query: str, predicted_class: str, confidence: float):
    if check_red_flags(user_query):
        return {"answer": "⚠️ Your symptoms may be urgent. Please seek medical attention immediately."}
    
    chunks = retrieve(f"{user_query} {predicted_class}")
    prompt = build_prompt(user_query, chunks, predicted_class, confidence)
    resp = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
    answer = add_safety(resp.text, predicted_class)
    return {"answer": answer}
