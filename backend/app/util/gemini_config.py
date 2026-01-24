import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def init_gemini():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY missing in .env")
    
    genai.configure(api_key=api_key)
    # Using gemini-1.5-flash for speed and efficiency
    return genai.GenerativeModel('gemini-1.5-flash')

# Initialize the model instance
model = init_gemini()