import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_PROJECT_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise ValueError("Supabase credentials missing in .env")
        
    return create_client(url, key)

# Initialize a singleton instance
supabase = get_supabase_client()