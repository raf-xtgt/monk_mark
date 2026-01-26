from uuid import UUID, uuid4
from typing import List, Optional
from util.supabase_config import supabase
from model.library.app_mm_library_hdr import AppMmLibraryHdrCreate, AppMmLibraryHdrUpdate, AppMmLibraryHdrResponse, AppMmLibraryHdrWithFileResponse

class AppMmLibraryHdrService:
    TABLE_NAME = "app_mm_library_hdr"
    FILE_UPLOAD_TABLE = "app_mm_file_upload"
    
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

    @staticmethod
    def get_library_hdrs_by_criteria(guid: Optional[UUID] = None, user_guid: Optional[UUID] = None, book_name: Optional[str] = None) -> List[AppMmLibraryHdrWithFileResponse]:
        """Get library headers by criteria with file storage path (manual join), ordered by last_read descending"""
        # First, query library headers with filters
        query = supabase.table(AppMmLibraryHdrService.TABLE_NAME).select("*")
        
        if guid:
            query = query.eq("guid", str(guid))
        if user_guid:
            query = query.eq("user_guid", str(user_guid))
        if book_name:
            query = query.ilike("book_name", f"%{book_name}%")
        
        # Order by last_read descending
        query = query.order("last_read", desc=True)
        
        library_response = query.execute()
        
        if not library_response.data:
            return []
        
        # Collect all unique file_guids that are not None
        file_guids = [item["file_guid"] for item in library_response.data if item.get("file_guid")]
        
        # Fetch file upload records if there are any file_guids
        file_map = {}
        if file_guids:
            file_response = supabase.table(AppMmLibraryHdrService.FILE_UPLOAD_TABLE).select("guid, storage_path").in_("guid", file_guids).execute()
            
            # Create a map of file_guid -> storage_path
            for file_record in file_response.data:
                file_map[file_record["guid"]] = file_record["storage_path"]
        
        # Combine the data
        result = []
        for item in library_response.data:
            file_guid = item.get("file_guid")
            storage_path = file_map.get(file_guid) if file_guid else None
            
            library_data = {
                "guid": item["guid"],
                "user_guid": item["user_guid"],
                "book_name": item["book_name"],
                "book_desc": item["book_desc"],
                "file_guid": item["file_guid"],
                "created_date": item["created_date"],
                "last_read": item["last_read"],
                "storage_path": storage_path
            }
            result.append(AppMmLibraryHdrWithFileResponse(**library_data))
        
        return result
