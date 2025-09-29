import faiss, numpy as np
from sentence_transformers import SentenceTransformer

MODEL = SentenceTransformer("all-MiniLM-L6-v2")
INDEX_PATH = "data/faiss_index/faiss.index"
META_PATH = "data/faiss_index/meta.npy"

index = faiss.read_index(INDEX_PATH)
meta = np.load(META_PATH, allow_pickle=True)

def retrieve(query, top_k=5):
    vec = MODEL.encode([query])
    D, I = index.search(np.array(vec), top_k)
    results = [meta[i] for i in I[0]]
    return results
