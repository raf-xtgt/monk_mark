from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class LibraryHdrQueryCriteria(BaseModel):
    guid: Optional[UUID]
    user_guid: Optional[UUID]
    book_name: Optional[str]
    

