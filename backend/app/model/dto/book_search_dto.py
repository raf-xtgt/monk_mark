from pydantic import BaseModel
import uuid 
from typing import Optional

class BookSearchRequestDto(BaseModel):
    book_name: str
    