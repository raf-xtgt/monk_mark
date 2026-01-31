from fastapi import APIRouter, status
from uuid import UUID
from typing import List
from model.notebook.app_mm_notebook_content_file_link import (
    AppMmNotebookContentFileLinkCreate,
    AppMmNotebookContentFileLinkUpdate,
    AppMmNotebookContentFileLinkResponse
)
from service.notebook.app_mm_notebook_content_file_link_service import NotebookContentFileLinkService
from model.api_response import ApiResponse

router = APIRouter(prefix="/notebook-content-file-links", tags=["notebook-content-file-links"])

@router.post("/create", response_model=ApiResponse[AppMmNotebookContentFileLinkResponse], status_code=status.HTTP_201_CREATED)
def create_link(link: AppMmNotebookContentFileLinkCreate):
    """Create a new notebook content file link"""
    try:
        result = NotebookContentFileLinkService.create(link)
        return ApiResponse.success(result)
    except Exception as e:
        return ApiResponse.error({"message": str(e)})

@router.get("/get-by-guid/{link_id}", response_model=ApiResponse[AppMmNotebookContentFileLinkResponse])
def get_link(link_id: UUID):
    """Get notebook content file link by GUID"""
    link = NotebookContentFileLinkService.get_by_guid(link_id)
    if not link:
        return ApiResponse.error({"message": "Notebook content file link not found"})
    return ApiResponse.success(link)

@router.get("/get-all", response_model=ApiResponse[List[AppMmNotebookContentFileLinkResponse]])
def get_all_links():
    """Get all notebook content file links"""
    links = NotebookContentFileLinkService.get_all()
    return ApiResponse.success(links)

@router.get("/get-by-user/{user_guid}", response_model=ApiResponse[List[AppMmNotebookContentFileLinkResponse]])
def get_links_by_user(user_guid: UUID):
    """Get all notebook content file links by user GUID"""
    links = NotebookContentFileLinkService.get_by_user(user_guid)
    return ApiResponse.success(links)

@router.get("/get-by-notebook-hdr/{notebook_hdr_guid}", response_model=ApiResponse[List[AppMmNotebookContentFileLinkResponse]])
def get_links_by_notebook_hdr(notebook_hdr_guid: UUID):
    """Get all notebook content file links by notebook header GUID"""
    links = NotebookContentFileLinkService.get_by_notebook_hdr(notebook_hdr_guid)
    return ApiResponse.success(links)

@router.get("/get-by-notebook-content/{notebook_content_guid}", response_model=ApiResponse[List[AppMmNotebookContentFileLinkResponse]])
def get_links_by_notebook_content(notebook_content_guid: UUID):
    """Get all notebook content file links by notebook content GUID"""
    links = NotebookContentFileLinkService.get_by_notebook_content(notebook_content_guid)
    return ApiResponse.success(links)

@router.get("/get-by-file-upload/{file_upload_guid}", response_model=ApiResponse[List[AppMmNotebookContentFileLinkResponse]])
def get_links_by_file_upload(file_upload_guid: UUID):
    """Get all notebook content file links by file upload GUID"""
    links = NotebookContentFileLinkService.get_by_file_upload(file_upload_guid)
    return ApiResponse.success(links)

@router.put("/update/{link_id}", response_model=ApiResponse[AppMmNotebookContentFileLinkResponse])
def update_link(link_id: UUID, link: AppMmNotebookContentFileLinkUpdate):
    """Update notebook content file link by GUID"""
    updated_link = NotebookContentFileLinkService.update(link_id, link)
    if not updated_link:
        return ApiResponse.error({"message": "Notebook content file link not found"})
    return ApiResponse.success(updated_link)

@router.delete("/delete-by-guid/{link_id}", response_model=ApiResponse[dict])
def delete_link(link_id: UUID):
    """Delete notebook content file link by GUID"""
    success = NotebookContentFileLinkService.delete_by_guid(link_id)
    if not success:
        return ApiResponse.error({"message": "Notebook content file link not found"})
    return ApiResponse.success({"message": "Notebook content file link deleted successfully"})
