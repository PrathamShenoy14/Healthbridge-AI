def check_red_flags(query):
    red_flags = [
        "fever", "blister", "spreading fast", "painful", 
        "difficulty breathing", "swelling", "infection", "pus"
    ]
    return any(flag in query.lower() for flag in red_flags)

def add_safety(answer, predicted_class=None):
    if predicted_class in ["melanoma", "squamous cell carcinoma", "basal cell carcinoma"]:
        answer += "\n\n⚠️ This may resemble a serious skin cancer. Please see a dermatologist urgently."
    else:
        answer += "\n\nℹ️ This is educational information, not a diagnosis. Always consult a dermatologist."
    return answer