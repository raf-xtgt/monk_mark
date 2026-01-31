import { API_BASE_URL } from '../_constants/api-constants';

export const NotebookContentFileLinkService = {
    async create(payload: {
        user_guid: string;
        notebook_hdr_guid: string;
        notebook_content_guid?: string;
        file_upload_guid?: string;
        image_url?: string;
        highlight_metadata?: Record<string, any>;
    }): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to create notebook content file link');
            }
        } catch (error) {
            console.error('Error creating notebook content file link:', error);
            throw error;
        }
    },

    async getByGuid(linkId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-by-guid/${linkId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get notebook content file link');
            }
        } catch (error) {
            console.error('Error getting notebook content file link:', error);
            throw error;
        }
    },

    async getAll(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get all notebook content file links');
            }
        } catch (error) {
            console.error('Error getting all notebook content file links:', error);
            throw error;
        }
    },

    async getByUser(userGuid: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-by-user/${userGuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get notebook content file links by user');
            }
        } catch (error) {
            console.error('Error getting notebook content file links by user:', error);
            throw error;
        }
    },

    async getByNotebookHdr(notebookHdrGuid: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-by-notebook-hdr/${notebookHdrGuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get notebook content file links by notebook header');
            }
        } catch (error) {
            console.error('Error getting notebook content file links by notebook header:', error);
            throw error;
        }
    },

    async getByNotebookContent(notebookContentGuid: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-by-notebook-content/${notebookContentGuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get notebook content file links by notebook content');
            }
        } catch (error) {
            console.error('Error getting notebook content file links by notebook content:', error);
            throw error;
        }
    },

    async getByFileUpload(fileUploadGuid: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/get-by-file-upload/${fileUploadGuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to get notebook content file links by file upload');
            }
        } catch (error) {
            console.error('Error getting notebook content file links by file upload:', error);
            throw error;
        }
    },

    async update(linkId: string, payload: {
        user_guid?: string;
        notebook_hdr_guid?: string;
        notebook_content_guid?: string;
        file_upload_guid?: string;
        image_url?: string;
        highlight_metadata?: Record<string, any>;
    }): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/update/${linkId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to update notebook content file link');
            }
        } catch (error) {
            console.error('Error updating notebook content file link:', error);
            throw error;
        }
    },

    async deleteByGuid(linkId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/delete-by-guid/${linkId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE') {
                return result.data;
            } else {
                throw new Error(result.data?.message || 'Failed to delete notebook content file link');
            }
        } catch (error) {
            console.error('Error deleting notebook content file link:', error);
            throw error;
        }
    },
};
