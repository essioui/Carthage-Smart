#!/usr/bin/env python3
import sys
import os
import cv2, base64
import numpy as np
import face_recognition
import requests
import json
from PIL import Image
from io import BytesIO

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_FOLDER = os.path.join(PROJECT_DIR, "images") 

def load_input_image(source):
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

    if source.startswith("data:image"):
        header, base64_data = source.split(",", 1)
        img_data = base64.b64decode(base64_data)
        img = np.array(Image.open(BytesIO(img_data)))
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    elif source.startswith("http://") or source.startswith("https://"):
        response = requests.get(source)
        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    elif source.lower() == "camera":
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise ValueError("Camera not opened")
        ret, frame = cap.read()
        cap.release()
        if not ret:
            raise ValueError("Photo not taken")
        img = frame

    else:
        image_path = os.path.join(SCRIPT_DIR, source)
        img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not loaded")
    return img


def find_best_match(image):
    """
    Compare the face of the image with the stored images
    Args:
        image: The input image
    """
    rgb_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb_img)
    if len(encodings) == 0:
        return None, 1.0
    input_encoding = encodings[0]

    min_distance = 1.0
    best_match_filename = None

    for filename in os.listdir(LOCAL_FOLDER):
        if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        local_path = os.path.join(LOCAL_FOLDER, filename)
        local_img = face_recognition.load_image_file(local_path)
        local_encodings = face_recognition.face_encodings(local_img)
        if len(local_encodings) == 0:
            continue
        
        for local_encoding in local_encodings:
            distance = face_recognition.face_distance([local_encoding], input_encoding)[0]
            if distance < min_distance:
                min_distance = distance
                best_match_filename = filename

    return best_match_filename, min_distance

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "The image path, URL, or the word camera must be passed."}))
        sys.exit(1)

    image_source = sys.argv[1]
    try:
        img = load_input_image(image_source)
        match, distance = find_best_match(img)
        if match:
            print(json.dumps({"match": match, "distance": float(distance)}))
        else:
            print(json.dumps({"match": None, "message": "No match found"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
