"""
CREATE TABLE IF NOT EXISTS app_mm_notebook_content (
    guid UUID PRIMARY KEY,
    user_guid UUID,
    notebook_hdr_guid UUID,
    library_hdr_guid UUID,
    content_text TEXT,
    image_url TEXT,
    highlight_metadata JSON,
    sequence_no SERIAL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_text ON app_mm_notebook_content USING BTREE (content_text);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_sequence_no ON app_mm_notebook_content USING BTREE (sequence_no);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_created_date ON app_mm_notebook_content USING BTREE (created_date);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_updated_date ON app_mm_notebook_content USING BTREE (updated_date);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_user_guid ON app_mm_notebook_content USING BTREE (user_guid);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_lib_guid ON app_mm_notebook_content USING BTREE (library_hdr_guid);
CREATE INDEX IF NOT EXISTS idx_app_mm_notebook_content_hdr_guid ON app_mm_notebook_content USING BTREE (notebook_hdr_guid);
"""
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any

class AppMmNotebookContentCreate(BaseModel):
    user_guid: UUID
    notebook_hdr_guid: UUID
    library_hdr_guid: Optional[UUID] = None
    content_text: Optional[str] = None
    image_url: Optional[str] = None
    highlight_metadata: Optional[Dict[str, Any]] = None
    sequence_no: Optional[int] = None

class AppMmNotebookContentUpdate(BaseModel):
    user_guid: Optional[UUID] = None
    notebook_hdr_guid: Optional[UUID] = None
    library_hdr_guid: Optional[UUID] = None
    content_text: Optional[str] = None
    image_url: Optional[str] = None
    highlight_metadata: Optional[Dict[str, Any]] = None
    sequence_no: Optional[int] = None

class AppMmNotebookContentResponse(BaseModel):
    guid: UUID
    user_guid: UUID
    notebook_hdr_guid: UUID
    library_hdr_guid: Optional[UUID] = None
    content_text: Optional[str] = None
    image_url: Optional[str] = None
    highlight_metadata: Optional[Dict[str, Any]] = None
    sequence_no: Optional[int] = None
    created_date: datetime
    updated_date: datetime

    class Config:
        from_attributes = True
