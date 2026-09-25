FROM python:3.11-slim

WORKDIR /app

# Install system libraries required by OpenCV and other dependencies.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to benefit from Docker caching.
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the application, model and FAISS data.
COPY . .

# Reduce unnecessary CPU parallelism.
ENV OMP_NUM_THREADS=2
ENV TF_NUM_INTEROP_THREADS=2
ENV TF_NUM_INTRAOP_THREADS=2

EXPOSE 8000

# Use the port provided by the hosting platform.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
