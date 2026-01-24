from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List
from model.user.app_mm_user import AppMmUserCreate, AppMmUserUpdate, AppMmUserResponse
from service.user.app_mm_user_service import AppMmUserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/create", response_model=AppMmUserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: AppMmUserCreate):
    """Create a new user"""
    try:
        return AppMmUserService.create_user(user)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("get-by-guid/{user_id}", response_model=AppMmUserResponse)
def get_user(user_id: UUID):
    """Get user by ID"""
    user = AppMmUserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/get-all", response_model=List[AppMmUserResponse])
def get_all_users():
    """Get all users"""
    return AppMmUserService.get_all_users()

@router.put("update/{user_id}", response_model=AppMmUserResponse)
def update_user(user_id: UUID, user: AppMmUserUpdate):
    """Update user by ID"""
    updated_user = AppMmUserService.update_user(user_id, user)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated_user

@router.delete("delete-by-guid/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID):
    """Delete user by ID"""
    success = AppMmUserService.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
