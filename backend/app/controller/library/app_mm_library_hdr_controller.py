from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.library.app_mm_library_hdr import AppMmLibraryHdrCreate, AppMmLibraryHdrUpdate, AppMmLibraryHdrResponse
from service.library.app_mm_library_hdr_service import AppMmLibraryHdrService

router = APIRouter(prefix="/librarys", tags=["library"])

@router.post("/create", response_model=AppMmLibraryHdrResponse, status_code=status.HTTP_201_CREATED)
def create_library_hdr(library_hdr: AppMmLibraryHdrCreate):
    """Create a new library header"""
    try:
        return AppMmLibraryHdrService.create_library_hdr(library_hdr)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/get-by-guid/{library_hdr_id}", response_model=AppMmLibraryHdrResponse)
def get_library_hdr(library_hdr_id: UUID):
    """Get library header by ID"""
    library_hdr = AppMmLibraryHdrService.get_library_hdr_by_id(library_hdr_id)
    if not library_hdr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library header not found")
    return library_hdr

@router.get("/get-all", response_model=List[AppMmLibraryHdrResponse])
def get_all_library_hdrs():
    """Get all library headers"""
    return AppMmLibraryHdrService.get_all_library_hdrs()

@router.get("/get-by-user/{user_guid}", response_model=List[AppMmLibraryHdrResponse])
def get_library_hdrs_by_user(user_guid: UUID):
    """Get all library headers for a specific user"""
    return AppMmLibraryHdrService.get_library_hdrs_by_user(user_guid)

@router.put("/update/{library_hdr_id}", response_model=AppMmLibraryHdrResponse)
def update_library_hdr(library_hdr_id: UUID, library_hdr: AppMmLibraryHdrUpdate):
    """Update library header by ID"""
    updated_library_hdr = AppMmLibraryHdrService.update_library_hdr(library_hdr_id, library_hdr)
    if not updated_library_hdr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library header not found")
    return updated_library_hdr

@router.delete("/delete-by-guid/{library_hdr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_library_hdr(library_hdr_id: UUID):
    """Delete library header by ID"""
    success = AppMmLibraryHdrService.delete_library_hdr(library_hdr_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library header not found")
