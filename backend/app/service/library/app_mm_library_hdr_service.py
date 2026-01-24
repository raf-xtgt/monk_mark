from uuid import UUID, uuid4
from typing import List, Optional
from util.supabase_config import supabase
from model.library.app_mm_library_hdr import AppMmLibraryHdrCreate, AppMmLibraryHdrUpdate, AppMmLibraryHdrResponse

class AppMmLibraryHdrService:
    TABLE_NAME = "app_mm_library_hdr"
    
    @staticmethod
    def create_library_hdr(library_hdr_data: AppMmLibraryHdrCreate) -> AppMmLibraryHdrResponse:
        """Create a new library header"""
        new_library_hdr = {
            "guid": str(uuid4()),
            "user_guid": str(library_hdr_data.user_guid),
            "book_name": library_hdr_data.book_name,
            "book_desc": library_hdr_data.book_desc,
            "file_guid": str(library_hdr_data.file_guid) if library_hdr_data.file_guid else None
        }
        
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).insert(new_library_hdr).execute()
        
        if not response.data:
            raise Exception("Failed to create library header")
        
        return AppMmLibraryHdrResponse(**response.data[0])
    
    @staticmethod
    def get_library_hdr_by_id(library_hdr_id: UUID) -> Optional[AppMmLibraryHdrResponse]:
        """Get library header by GUID"""
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).select("*").eq("guid", str(library_hdr_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmLibraryHdrResponse(**response.data[0])
    
    @staticmethod
    def get_all_library_hdrs() -> List[AppMmLibraryHdrResponse]:
        """Get all library headers"""
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).select("*").execute()
        
        return [AppMmLibraryHdrResponse(**library_hdr) for library_hdr in response.data]
    
    @staticmethod
    def get_library_hdrs_by_user(user_guid: UUID) -> List[AppMmLibraryHdrResponse]:
        """Get all library headers for a specific user"""
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).select("*").eq("user_guid", str(user_guid)).execute()
        
        return [AppMmLibraryHdrResponse(**library_hdr) for library_hdr in response.data]
    
    @staticmethod
    def update_library_hdr(library_hdr_id: UUID, library_hdr_data: AppMmLibraryHdrUpdate) -> Optional[AppMmLibraryHdrResponse]:
        """Update library header by GUID"""
        update_data = library_hdr_data.model_dump(exclude_unset=True)
        
        if not update_data:
            return AppMmLibraryHdrService.get_library_hdr_by_id(library_hdr_id)
        
        # Convert UUID to string for Supabase
        if "file_guid" in update_data:
            update_data["file_guid"] = str(update_data["file_guid"]) if update_data["file_guid"] else None
        
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).update(update_data).eq("guid", str(library_hdr_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmLibraryHdrResponse(**response.data[0])
    
    @staticmethod
    def delete_library_hdr(library_hdr_id: UUID) -> bool:
        """Delete library header by GUID"""
        response = supabase.table(AppMmLibraryHdrService.TABLE_NAME).delete().eq("guid", str(library_hdr_id)).execute()
        
        return len(response.data) > 0
