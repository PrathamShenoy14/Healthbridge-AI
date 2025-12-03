import os, fitz, faiss
import numpy as np
from sentence_transformers import SentenceTransformer

DATA_DIR = "data/pdfs"
INDEX_DIR = "data/faiss_index"
MODEL = SentenceTransformer("all-MiniLM-L6-v2")  # can swap with Gemini embeddings

def pdf_to_chunks(pdf_path, chunk_size=500, overlap=100):
    doc = fitz.open(pdf_path)
    chunks = []
    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        words = text.split()
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i+chunk_size])
            chunks.append({
                "text": chunk,
                "meta": {"file": os.path.basename(pdf_path), "page": page_num+1}
            })
    return chunks

def build_index():
    os.makedirs(INDEX_DIR, exist_ok=True)
    all_chunks = []
    for file in os.listdir(DATA_DIR):
        if file.endswith(".pdf"):
            chunks = pdf_to_chunks(os.path.join(DATA_DIR, file))
            all_chunks.extend(chunks)
    
    texts = [c["text"] for c in all_chunks]
    vectors = MODEL.encode(texts, show_progress_bar=True)
    
    dim = vectors.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(vectors))
    
    faiss.write_index(index, f"{INDEX_DIR}/faiss.index")
    np.save(f"{INDEX_DIR}/meta.npy", np.array(all_chunks, dtype=object))

if __name__ == "__main__":
    build_index()
