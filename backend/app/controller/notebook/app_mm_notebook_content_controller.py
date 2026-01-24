from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.notebook.app_mm_notebook_content import AppMmNotebookContentCreate, AppMmNotebookContentUpdate, AppMmNotebookContentResponse
from service.notebook.app_mm_notebook_content_service import AppMmNotebookContentService

router = APIRouter(prefix="/notebook-contents", tags=["notebook-contents"])

@router.post("/create", response_model=AppMmNotebookContentResponse, status_code=status.HTTP_201_CREATED)
def create_notebook_content(content: AppMmNotebookContentCreate):
    """Create a new notebook content entry"""
    try:
        return AppMmNotebookContentService.create_notebook_content(content)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/get-by-guid/{content_id}", response_model=AppMmNotebookContentResponse)
def get_notebook_content(content_id: UUID):
    """Get notebook content by ID"""
    content = AppMmNotebookContentService.get_notebook_content_by_id(content_id)
    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook content not found")
    return content

@router.get("/get-all", response_model=List[AppMmNotebookContentResponse])
def get_all_notebook_contents():
    """Get all notebook contents"""
    return AppMmNotebookContentService.get_all_notebook_contents()

@router.get("/get-by-notebook-hdr/{notebook_hdr_guid}", response_model=List[AppMmNotebookContentResponse])
def get_contents_by_notebook_hdr(notebook_hdr_guid: UUID):
    """Get all contents for a specific notebook header"""
    return AppMmNotebookContentService.get_contents_by_notebook_hdr(notebook_hdr_guid)

@router.get("/get-by-user/{user_guid}", response_model=List[AppMmNotebookContentResponse])
def get_contents_by_user(user_guid: UUID):
    """Get all contents for a specific user"""
    return AppMmNotebookContentService.get_contents_by_user(user_guid)

@router.put("/update/{content_id}", response_model=AppMmNotebookContentResponse)
def update_notebook_content(content_id: UUID, content: AppMmNotebookContentUpdate):
    """Update notebook content by ID"""
    updated_content = AppMmNotebookContentService.update_notebook_content(content_id, content)
    if not updated_content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook content not found")
    return updated_content

@router.delete("/delete-by-guid/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notebook_content(content_id: UUID):
    """Delete notebook content by ID"""
    success = AppMmNotebookContentService.delete_notebook_content(content_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook content not found")
