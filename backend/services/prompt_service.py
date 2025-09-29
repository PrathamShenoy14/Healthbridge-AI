def build_prompt(user_query, retrieved_chunks, predicted_class=None, confidence=None):
    sources = "\n\n".join([
        f"{c['text']} (Source: {c['meta']['file']} p{c['meta']['page']})"
        for c in retrieved_chunks
    ])

    classifier_note = ""
    if predicted_class:
        classifier_note = (
            f"The lesion classifier suggested: {predicted_class} "
            f"(confidence {confidence:.2f}).\n"
        )

    return f"""
You are a dermatology assistant chatbot. 
STRICT RULES:
- Only use the provided sources below.
- Never invent or guess conditions not in the sources.
- Always format the answer into the following sections:

### 🔍 Possible Condition
(Explain what it might be, reference classifier if available)

### 📖 Info from Leaflets
(Summarize key points with citations from the sources)

### 🧴 Self-Care Tips
(Simple, safe, evidence-based tips)

### ⚠️ Red Flags
(When to urgently consult a dermatologist or go to ER)

### ℹ️ Disclaimer
("This is not a diagnosis. Always consult a dermatologist.")

Patient query: {user_query}

{classifier_note}

Relevant sources:
{sources}
"""
