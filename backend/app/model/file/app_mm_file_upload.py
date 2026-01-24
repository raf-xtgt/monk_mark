"""
CREATE TABLE IF NOT EXISTS app_mm_file_upload (
    guid UUID PRIMARY KEY,
    user_guid UUID,
    file_name VARCHAR(255),
    mime_type VARCHAR(255),
    metadata JSON,
    storage_path TEXT,
    bucket_name TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_mm_file_upload_mime_type ON app_mm_file_upload USING BTREE (mime_type);
CREATE INDEX IF NOT EXISTS idx_app_mm_file_upload_file_name ON app_mm_file_upload USING BTREE (file_name);
CREATE INDEX IF NOT EXISTS idx_app_mm_file_upload_created_date ON app_mm_file_upload USING BTREE (created_date);
CREATE INDEX IF NOT EXISTS idx_app_mm_file_upload_updated_date ON app_mm_file_upload USING BTREE (updated_date);
CREATE INDEX IF NOT EXISTS idx_app_mm_file_upload_user_guid ON app_mm_file_upload USING BTREE (user_guid);
"""
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any

class AppMmFileUploadCreate(BaseModel):
    user_guid: UUID
    file_name: str
    mime_type: str
    metadata: Optional[Dict[str, Any]] = None
    storage_path: str
    bucket_name: str
    is_public: bool = False

class AppMmFileUploadUpdate(BaseModel):
    user_guid: Optional[UUID] = None
    file_name: Optional[str] = None
    mime_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    storage_path: Optional[str] = None
    bucket_name: Optional[str] = None
    is_public: Optional[bool] = None

class AppMmFileUploadResponse(BaseModel):
    guid: UUID
    user_guid: UUID
    file_name: str
    mime_type: str
    metadata: Optional[Dict[str, Any]] = None
    storage_path: str
    bucket_name: str
    is_public: bool
    created_date: datetime
    updated_date: datetime

    class Config:
        from_attributes = True
