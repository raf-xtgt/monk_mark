from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

"""
SQL Schema:
CREATE TABLE IF NOT EXISTS app_mm_notebook_llm_chat_transcript (
    guid UUID PRIMARY KEY,
    user_guid UUID,
    llm_chat_hdr_guid UUID,
    msg_content TEXT,
    sender VARCHAR(100),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);
"""

class AppMmNotebookLlmChatTranscriptCreate(BaseModel):
    user_guid: UUID
    llm_chat_hdr_guid: UUID
    msg_content: str
    sender: str

class AppMmNotebookLlmChatTranscriptUpdate(BaseModel):
    user_guid: Optional[UUID] = None
    llm_chat_hdr_guid: Optional[UUID] = None
    msg_content: Optional[str] = None
    sender: Optional[str] = None

class AppMmNotebookLlmChatTranscriptResponse(BaseModel):
    guid: UUID
    user_guid: UUID
    llm_chat_hdr_guid: UUID
    msg_content: str
    sender: str
    created_date: datetime
    updated_date: datetime

    class Config:
        from_attributes = True
