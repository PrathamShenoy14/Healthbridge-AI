import keras
import numpy as np
import cv2
from fastapi import UploadFile

# Load the model globally
model = keras.models.load_model("my_keras_model.keras")

class_names = [
    'actinic keratosis',
    'basal cell carcinoma',
    'dermatofibroma',
    'melanoma',
    'nevus',
    'pigmented benign keratosis',
    'seborrheic keratosis',
    'squamous cell carcinoma',
    'vascular lesion'
]

async def preprocess_image(image_file: UploadFile, target_size=(176, 176)):
    """
    Read image from FastAPI UploadFile, preprocess for ML model:
    - Decode with OpenCV
    - Convert BGR -> RGB
    - Resize to target_size
    - Normalize to [0,1]
    - Add batch dimension
    Returns None if no file or decoding fails.
    """
    if image_file is None:
        return None

    try:
        # Reset file pointer in case it was read before
        await image_file.seek(0)  # <-- important
        contents = await image_file.read()
        file_bytes = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is None:
            print("Warning: Failed to decode image")
            return None

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, target_size)
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)  # Add batch dimension
        return img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None


async def classify(image_file: UploadFile):
    img = await preprocess_image(image_file)
    if img is None:
        # Return a default if preprocessing fails
        return "unknown", 0.0

    # Keras expects a batch dimension, which we added
    preds = model.predict(img)
    top_idx = np.argmax(preds[0])
    confidence = float(preds[0][top_idx])
    label = class_names[top_idx]
    return label, round(confidence * 100, 2)
