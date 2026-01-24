"""
CREATE TABLE IF NOT EXISTS app_mm_user (
    guid UUID PRIMARY KEY,
    email VARCHAR(255), 
    created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_app_mm_user_email ON app_mm_user USING BTREE (email);
CREATE INDEX idx_app_mm_user_created_date ON app_mm_user USING BTREE (created_date);
"""
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AppMmUserCreate(BaseModel):
    email: str

class AppMmUserUpdate(BaseModel):
    email: Optional[str] = None

class AppMmUserResponse(BaseModel):
    guid: UUID
    email: str
    created_date: datetime

    class Config:
        from_attributes = True