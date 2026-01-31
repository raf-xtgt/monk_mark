from uuid import UUID, uuid4
from typing import List, Optional
from util.supabase_config import supabase
from model.notebook.app_mm_notebook_content_file_link import (
    AppMmNotebookContentFileLinkCreate,
    AppMmNotebookContentFileLinkUpdate,
    AppMmNotebookContentFileLinkResponse
)

class NotebookContentFileLinkService:
    TABLE_NAME = "app_mm_notebook_content_file_link"
    
    @staticmethod
    def create(link_data: AppMmNotebookContentFileLinkCreate) -> AppMmNotebookContentFileLinkResponse:
        """Create a new notebook content file link"""
        new_link = {
            "guid": str(uuid4()),
            "user_guid": str(link_data.user_guid),
            "notebook_hdr_guid": str(link_data.notebook_hdr_guid),
            "notebook_content_guid": str(link_data.notebook_content_guid) if link_data.notebook_content_guid else None,
            "file_upload_guid": str(link_data.file_upload_guid) if link_data.file_upload_guid else None,
            "image_url": link_data.image_url,
            "highlight_metadata": link_data.highlight_metadata
        }
        
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).insert(new_link).execute()
        
        if not response.data:
            raise Exception("Failed to create notebook content file link")
        
        return AppMmNotebookContentFileLinkResponse(**response.data[0])
    
    @staticmethod
    def get_by_guid(link_id: UUID) -> Optional[AppMmNotebookContentFileLinkResponse]:
        """Get notebook content file link by GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").eq("guid", str(link_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmNotebookContentFileLinkResponse(**response.data[0])
    
    @staticmethod
    def get_all() -> List[AppMmNotebookContentFileLinkResponse]:
        """Get all notebook content file links"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").execute()
        
        return [AppMmNotebookContentFileLinkResponse(**link) for link in response.data]
    
    @staticmethod
    def get_by_user(user_guid: UUID) -> List[AppMmNotebookContentFileLinkResponse]:
        """Get all notebook content file links by user GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").eq("user_guid", str(user_guid)).execute()
        
        return [AppMmNotebookContentFileLinkResponse(**link) for link in response.data]
    
    @staticmethod
    def get_by_notebook_hdr(notebook_hdr_guid: UUID) -> List[AppMmNotebookContentFileLinkResponse]:
        """Get all notebook content file links by notebook header GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").eq("notebook_hdr_guid", str(notebook_hdr_guid)).execute()
        
        return [AppMmNotebookContentFileLinkResponse(**link) for link in response.data]
    
    @staticmethod
    def get_by_notebook_content(notebook_content_guid: UUID) -> List[AppMmNotebookContentFileLinkResponse]:
        """Get all notebook content file links by notebook content GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").eq("notebook_content_guid", str(notebook_content_guid)).execute()
        
        return [AppMmNotebookContentFileLinkResponse(**link) for link in response.data]
    
    @staticmethod
    def get_by_file_upload(file_upload_guid: UUID) -> List[AppMmNotebookContentFileLinkResponse]:
        """Get all notebook content file links by file upload GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).select("*").eq("file_upload_guid", str(file_upload_guid)).execute()
        
        return [AppMmNotebookContentFileLinkResponse(**link) for link in response.data]
    
    @staticmethod
    def update(link_id: UUID, link_data: AppMmNotebookContentFileLinkUpdate) -> Optional[AppMmNotebookContentFileLinkResponse]:
        """Update notebook content file link by GUID"""
        update_data = link_data.model_dump(exclude_unset=True)
        
        if not update_data:
            return NotebookContentFileLinkService.get_by_guid(link_id)
        
        # Convert UUID fields to strings
        if "user_guid" in update_data:
            update_data["user_guid"] = str(update_data["user_guid"])
        if "notebook_hdr_guid" in update_data:
            update_data["notebook_hdr_guid"] = str(update_data["notebook_hdr_guid"])
        if "notebook_content_guid" in update_data:
            update_data["notebook_content_guid"] = str(update_data["notebook_content_guid"]) if update_data["notebook_content_guid"] else None
        if "file_upload_guid" in update_data:
            update_data["file_upload_guid"] = str(update_data["file_upload_guid"]) if update_data["file_upload_guid"] else None
        
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).update(update_data).eq("guid", str(link_id)).execute()
        
        if not response.data:
            return None
        
        return AppMmNotebookContentFileLinkResponse(**response.data[0])
    
    @staticmethod
    def delete_by_guid(link_id: UUID) -> bool:
        """Delete notebook content file link by GUID"""
        response = supabase.table(NotebookContentFileLinkService.TABLE_NAME).delete().eq("guid", str(link_id)).execute()
        
        return len(response.data) > 0
