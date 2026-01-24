from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.library.app_mm_library_hdr import AppMmLibraryHdrCreate, AppMmLibraryHdrUpdate, AppMmLibraryHdrResponse
from service.library.app_mm_library_hdr_service import AppMmLibraryHdrService
from model.api_response import ApiResponse
from model.dto.book_search_dto import BookSearchRequestDto

router = APIRouter(prefix="/librarys", tags=["library"])

@router.post("/create", response_model=ApiResponse[AppMmLibraryHdrResponse], status_code=status.HTTP_201_CREATED)
def create_library_hdr(library_hdr: AppMmLibraryHdrCreate):
    """Create a new library header"""
    try:
        result = AppMmLibraryHdrService.create_library_hdr(library_hdr)
        return ApiResponse.success(result)
    except Exception as e:
        return ApiResponse.error({"message": str(e)})

@router.get("/get-by-guid/{library_hdr_id}", response_model=ApiResponse[AppMmLibraryHdrResponse])
def get_library_hdr(library_hdr_id: UUID):
    """Get library header by ID"""
    library_hdr = AppMmLibraryHdrService.get_library_hdr_by_id(library_hdr_id)
    if not library_hdr:
        return ApiResponse.error({"message": "Library header not found"})
    return ApiResponse.success(library_hdr)

@router.get("/get-all", response_model=ApiResponse[List[AppMmLibraryHdrResponse]])
def get_all_library_hdrs():
    """Get all library headers"""
    libraries = AppMmLibraryHdrService.get_all_library_hdrs()
    return ApiResponse.success(libraries)

@router.get("/get-by-user/{user_guid}", response_model=ApiResponse[List[AppMmLibraryHdrResponse]])
def get_library_hdrs_by_user(user_guid: UUID):
    """Get all library headers for a specific user"""
    libraries = AppMmLibraryHdrService.get_library_hdrs_by_user(user_guid)
    return ApiResponse.success(libraries)

@router.put("/update/{library_hdr_id}", response_model=ApiResponse[AppMmLibraryHdrResponse])
def update_library_hdr(library_hdr_id: UUID, library_hdr: AppMmLibraryHdrUpdate):
    """Update library header by ID"""
    updated_library_hdr = AppMmLibraryHdrService.update_library_hdr(library_hdr_id, library_hdr)
    if not updated_library_hdr:
        return ApiResponse.error({"message": "Library header not found"})
    return ApiResponse.success(updated_library_hdr)

@router.delete("/delete-by-guid/{library_hdr_id}", response_model=ApiResponse[dict])
def delete_library_hdr(library_hdr_id: UUID):
    """Delete library header by ID"""
    success = AppMmLibraryHdrService.delete_library_hdr(library_hdr_id)
    if not success:
        return ApiResponse.error({"message": "Library header not found"})
    return ApiResponse.success({"message": "Library header deleted successfully"})

@router.post("/search-book", response_model=ApiResponse[AppMmLibraryHdrResponse], status_code=status.HTTP_201_CREATED)
def create_library_hdr(searchDto: BookSearchRequestDto):
    """
    TODO: Uses the Google Books Api to return book information given a book name as the input.
    Input: Book name "Deep Work"
    Output: "Image/Thumbnail/Cover of the Book", "A short description" and the "name of the author"
    Logic: If there is an image of the book cover, store it in the supabase storage. Then 
    """