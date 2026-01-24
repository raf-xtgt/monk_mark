from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.notebook.app_mm_notebook_hdr import AppMmNotebookHdrCreate, AppMmNotebookHdrUpdate, AppMmNotebookHdrResponse
from service.notebook.app_mm_notebook_hdr_service import AppMmNotebookHdrService

router = APIRouter(prefix="/notebooks", tags=["notebook"])

@router.post("/create", response_model=AppMmNotebookHdrResponse, status_code=status.HTTP_201_CREATED)
def create_notebook_hdr(notebook_hdr: AppMmNotebookHdrCreate):
    """Create a new notebook header"""
    try:
        return AppMmNotebookHdrService.create_notebook_hdr(notebook_hdr)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/get-by-guid/{notebook_hdr_id}", response_model=AppMmNotebookHdrResponse)
def get_notebook_hdr(notebook_hdr_id: UUID):
    """Get notebook header by ID"""
    notebook_hdr = AppMmNotebookHdrService.get_notebook_hdr_by_id(notebook_hdr_id)
    if not notebook_hdr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook header not found")
    return notebook_hdr

@router.get("/get-all", response_model=List[AppMmNotebookHdrResponse])
def get_all_notebook_hdrs():
    """Get all notebook headers"""
    return AppMmNotebookHdrService.get_all_notebook_hdrs()

@router.get("/get-by-user/{user_guid}", response_model=List[AppMmNotebookHdrResponse])
def get_notebook_hdrs_by_user(user_guid: UUID):
    """Get all notebook headers for a specific user"""
    return AppMmNotebookHdrService.get_notebook_hdrs_by_user(user_guid)

@router.get("/get-by-library/{library_hdr_guid}", response_model=List[AppMmNotebookHdrResponse])
def get_notebook_hdrs_by_library(library_hdr_guid: UUID):
    """Get all notebook headers for a specific library"""
    return AppMmNotebookHdrService.get_notebook_hdrs_by_library(library_hdr_guid)

@router.put("/update/{notebook_hdr_id}", response_model=AppMmNotebookHdrResponse)
def update_notebook_hdr(notebook_hdr_id: UUID, notebook_hdr: AppMmNotebookHdrUpdate):
    """Update notebook header by ID"""
    updated_notebook_hdr = AppMmNotebookHdrService.update_notebook_hdr(notebook_hdr_id, notebook_hdr)
    if not updated_notebook_hdr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook header not found")
    return updated_notebook_hdr

@router.delete("/delete-by-guid/{notebook_hdr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notebook_hdr(notebook_hdr_id: UUID):
    """Delete notebook header by ID"""
    success = AppMmNotebookHdrService.delete_notebook_hdr(notebook_hdr_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook header not found")
