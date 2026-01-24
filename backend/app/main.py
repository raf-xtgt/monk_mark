from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from controller.user.app_mm_user_controller import router as user_router

load_dotenv()

app = FastAPI(title="Monk Mark Web Application Service")


origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url_prefix = "/api/mm"

# Include routers
app.include_router(user_router, prefix=url_prefix)

@app.get("/")
def read_root():
    return {"message": "Monk mark api running"}

