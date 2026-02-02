from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from controller.user.app_mm_user_controller import router as user_router
from controller.library.app_mm_library_hdr_controller import router as library_router
from controller.notebook.app_mm_notebook_hdr_controller import router as notebook_router
from controller.notebook.app_mm_notebook_content_controller import router as notebook_content_router
from controller.notebook.app_mm_notebook_content_file_link_controller import router as notebook_content_file_link_router
from controller.notebook.app_mm_notebook_llm_chat_hdr_controller import router as notebook_llm_chat_hdr_router
from controller.notebook.app_mm_notebook_llm_chat_transcript_controller import router as notebook_llm_chat_transcript_router
from controller.file.app_mm_file_upload_controller import router as file_upload_router
from controller.focus_session.app_mm_focus_session_controller import router as focus_session_router

load_dotenv()

app = FastAPI(title="Monk Mark Web Application Service")


# origins = ["http://localhost:3000"]
# Change this to allow all for prototyping
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any source to access the API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url_prefix = "/api/mm"

# Include routers
app.include_router(user_router, prefix=url_prefix)
app.include_router(library_router, prefix=url_prefix)
app.include_router(notebook_router, prefix=url_prefix)
app.include_router(notebook_content_router, prefix=url_prefix)
app.include_router(notebook_content_file_link_router, prefix=url_prefix)
app.include_router(notebook_llm_chat_hdr_router, prefix=url_prefix)
app.include_router(notebook_llm_chat_transcript_router, prefix=url_prefix)
app.include_router(file_upload_router, prefix=url_prefix)
app.include_router(focus_session_router, prefix=url_prefix)

@app.get("/")
def read_root():
    return {"message": "Monk mark api running"}

