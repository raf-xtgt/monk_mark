from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.file.app_mm_file_upload import AppMmFileUploadCreate, AppMmFileUploadUpdate, AppMmFileUploadResponse
from service.file.app_mm_file_upload_service import AppMmFileUploadService

router = APIRouter(prefix="/file-uploads", tags=["file-uploads"])

@router.post("/create", response_model=AppMmFileUploadResponse, status_code=status.HTTP_201_CREATED)
def create_file_upload(file: AppMmFileUploadCreate):
    """Create a new file upload record"""
    try:
        return AppMmFileUploadService.create_file_upload(file)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/get-by-guid/{file_id}", response_model=AppMmFileUploadResponse)
def get_file_upload(file_id: UUID):
    """Get file upload by ID"""
    file = AppMmFileUploadService.get_file_upload_by_id(file_id)
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File upload not found")
    return file

@router.get("/get-all", response_model=List[AppMmFileUploadResponse])
def get_all_file_uploads():
    """Get all file uploads"""
    return AppMmFileUploadService.get_all_file_uploads()

@router.get("/get-by-user/{user_guid}", response_model=List[AppMmFileUploadResponse])
def get_files_by_user(user_guid: UUID):
    """Get all files for a specific user"""
    return AppMmFileUploadService.get_files_by_user(user_guid)

@router.get("/get-by-mime-type/{mime_type}", response_model=List[AppMmFileUploadResponse])
def get_files_by_mime_type(mime_type: str):
    """Get all files by mime type"""
    return AppMmFileUploadService.get_files_by_mime_type(mime_type)

@router.put("/update/{file_id}", response_model=AppMmFileUploadResponse)
def update_file_upload(file_id: UUID, file: AppMmFileUploadUpdate):
    """Update file upload by ID"""
    updated_file = AppMmFileUploadService.update_file_upload(file_id, file)
    if not updated_file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File upload not found")
    return updated_file

@router.delete("/delete-by-guid/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file_upload(file_id: UUID):
    """Delete file upload by ID"""
    success = AppMmFileUploadService.delete_file_upload(file_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File upload not found")
