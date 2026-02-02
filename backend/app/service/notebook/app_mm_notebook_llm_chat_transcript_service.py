from uuid import UUID, uuid4
from typing import List, Optional
from datetime import datetime
from util.supabase_config import supabase
from model.notebook.app_mm_notebook_llm_chat_transcript import (
    AppMmNotebookLlmChatTranscriptCreate,
    AppMmNotebookLlmChatTranscriptUpdate,
    AppMmNotebookLlmChatTranscriptResponse
)

class NotebookLlmChatTranscriptService:
    TABLE_NAME = "app_mm_notebook_llm_chat_transcript"
    
    @staticmethod
    def create_transcript(transcript_data: AppMmNotebookLlmChatTranscriptCreate) -> AppMmNotebookLlmChatTranscriptResponse:
        """Create a new notebook LLM chat transcript"""
        new_transcript = {
            "guid": str(uuid4()),
            "user_guid": str(transcript_data.user_guid),
            "llm_chat_hdr_guid": str(transcript_data.llm_chat_hdr_guid),
            "msg_content": transcript_data.msg_content,
            "sender": transcript_data.sender
        }
        
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).insert(new_transcript).execute()
        
        if not response.data:
            raise Exception("Failed to create notebook LLM chat transcript")
        
        return AppMmNotebookLlmChatTranscriptResponse(**response.data[0])
    
    @staticmethod
    def get_transcript_by_id(transcript_id: UUID) -> Optional[AppMmNotebookLlmChatTranscriptResponse]:
        """Get notebook LLM chat transcript by GUID"""
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).select("*").eq("guid", str(transcript_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmNotebookLlmChatTranscriptResponse(**response.data[0])
    
    @staticmethod
    def get_all_transcripts() -> List[AppMmNotebookLlmChatTranscriptResponse]:
        """Get all notebook LLM chat transcripts"""
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).select("*").execute()
        
        return [AppMmNotebookLlmChatTranscriptResponse(**transcript) for transcript in response.data]
    
    @staticmethod
    def get_transcripts_by_user(user_guid: UUID) -> List[AppMmNotebookLlmChatTranscriptResponse]:
        """Get all notebook LLM chat transcripts for a specific user"""
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).select("*").eq("user_guid", str(user_guid)).execute()
        
        return [AppMmNotebookLlmChatTranscriptResponse(**transcript) for transcript in response.data]
    
    @staticmethod
    def get_transcripts_by_chat_hdr(llm_chat_hdr_guid: UUID) -> List[AppMmNotebookLlmChatTranscriptResponse]:
        """Get all notebook LLM chat transcripts for a specific chat header"""
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).select("*").eq("llm_chat_hdr_guid", str(llm_chat_hdr_guid)).order("created_date").execute()
        
        return [AppMmNotebookLlmChatTranscriptResponse(**transcript) for transcript in response.data]
    
    @staticmethod
    def update_transcript(transcript_id: UUID, transcript_data: AppMmNotebookLlmChatTranscriptUpdate) -> Optional[AppMmNotebookLlmChatTranscriptResponse]:
        """Update notebook LLM chat transcript by GUID"""
        update_data = transcript_data.model_dump(exclude_unset=True)
        
        if not update_data:
            return NotebookLlmChatTranscriptService.get_transcript_by_id(transcript_id)
        
        # Convert UUIDs to strings
        if "user_guid" in update_data:
            update_data["user_guid"] = str(update_data["user_guid"])
        if "llm_chat_hdr_guid" in update_data:
            update_data["llm_chat_hdr_guid"] = str(update_data["llm_chat_hdr_guid"])
        
        # Add updated_date
        update_data["updated_date"] = datetime.now().isoformat()
        
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).update(update_data).eq("guid", str(transcript_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmNotebookLlmChatTranscriptResponse(**response.data[0])
    
    @staticmethod
    def delete_transcript(transcript_id: UUID) -> bool:
        """Delete notebook LLM chat transcript by GUID"""
        response = supabase.table(NotebookLlmChatTranscriptService.TABLE_NAME).delete().eq("guid", str(transcript_id)).execute()
        
        return len(response.data) > 0
