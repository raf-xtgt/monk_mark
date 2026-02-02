from fastapi import APIRouter, status
from uuid import UUID
from typing import List
from model.notebook.app_mm_notebook_llm_chat_transcript import (
    AppMmNotebookLlmChatTranscriptCreate,
    AppMmNotebookLlmChatTranscriptUpdate,
    AppMmNotebookLlmChatTranscriptResponse
)
from service.notebook.app_mm_notebook_llm_chat_transcript_service import NotebookLlmChatTranscriptService
from model.api_response import ApiResponse

router = APIRouter(prefix="/notebook-llm-chat-transcripts", tags=["notebook-llm-chat-transcripts"])

@router.post("/create", response_model=ApiResponse[AppMmNotebookLlmChatTranscriptResponse], status_code=status.HTTP_201_CREATED)
def create_transcript(transcript: AppMmNotebookLlmChatTranscriptCreate):
    """Create a new notebook LLM chat transcript"""
    try:
        result = NotebookLlmChatTranscriptService.create_transcript(transcript)
        return ApiResponse.success(result)
    except Exception as e:
        return ApiResponse.error({"message": str(e)})

@router.get("/get-by-guid/{transcript_id}", response_model=ApiResponse[AppMmNotebookLlmChatTranscriptResponse])
def get_transcript(transcript_id: UUID):
    """Get notebook LLM chat transcript by ID"""
    transcript = NotebookLlmChatTranscriptService.get_transcript_by_id(transcript_id)
    if not transcript:
        return ApiResponse.error({"message": "Notebook LLM chat transcript not found"})
    return ApiResponse.success(transcript)

@router.get("/get-all", response_model=ApiResponse[List[AppMmNotebookLlmChatTranscriptResponse]])
def get_all_transcripts():
    """Get all notebook LLM chat transcripts"""
    transcripts = NotebookLlmChatTranscriptService.get_all_transcripts()
    return ApiResponse.success(transcripts)

@router.get("/get-by-user/{user_guid}", response_model=ApiResponse[List[AppMmNotebookLlmChatTranscriptResponse]])
def get_transcripts_by_user(user_guid: UUID):
    """Get all notebook LLM chat transcripts for a specific user"""
    transcripts = NotebookLlmChatTranscriptService.get_transcripts_by_user(user_guid)
    return ApiResponse.success(transcripts)

@router.get("/get-by-chat-hdr/{llm_chat_hdr_guid}", response_model=ApiResponse[List[AppMmNotebookLlmChatTranscriptResponse]])
def get_transcripts_by_chat_hdr(llm_chat_hdr_guid: UUID):
    """Get all notebook LLM chat transcripts for a specific chat header (ordered by created_date)"""
    transcripts = NotebookLlmChatTranscriptService.get_transcripts_by_chat_hdr(llm_chat_hdr_guid)
    return ApiResponse.success(transcripts)

@router.put("/update/{transcript_id}", response_model=ApiResponse[AppMmNotebookLlmChatTranscriptResponse])
def update_transcript(transcript_id: UUID, transcript: AppMmNotebookLlmChatTranscriptUpdate):
    """Update notebook LLM chat transcript by ID"""
    updated_transcript = NotebookLlmChatTranscriptService.update_transcript(transcript_id, transcript)
    if not updated_transcript:
        return ApiResponse.error({"message": "Notebook LLM chat transcript not found"})
    return ApiResponse.success(updated_transcript)

@router.delete("/delete-by-guid/{transcript_id}", response_model=ApiResponse[dict])
def delete_transcript(transcript_id: UUID):
    """Delete notebook LLM chat transcript by ID"""
    success = NotebookLlmChatTranscriptService.delete_transcript(transcript_id)
    if not success:
        return ApiResponse.error({"message": "Notebook LLM chat transcript not found"})
    return ApiResponse.success({"message": "Notebook LLM chat transcript deleted successfully"})
