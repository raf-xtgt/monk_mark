import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    """Get Supabase client with anon key (for client-side operations)"""
    url = os.environ.get("SUPABASE_PROJECT_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise ValueError("Supabase credentials missing in .env")
        
    return create_client(url, key)

def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key (bypasses RLS for backend operations)"""
    url = os.environ.get("SUPABASE_PROJECT_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not service_key:
        raise ValueError("Supabase service role credentials missing in .env")
        
    return create_client(url, service_key)

# Initialize singleton instances
supabase = get_supabase_client()
supabase_admin = get_supabase_admin_client()