# Use official slim Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files (app.py, static, serialized models)
COPY . .

# Ensure model and scaler files exist (they will be pre-trained and copied)
# Expose port (7860 is standard for Hugging Face Spaces, Render will override PORT variable)
ENV PORT=7860
EXPOSE 7860

# Run gunicorn server
CMD gunicorn --bind 0.0.0.0:$PORT app:app
