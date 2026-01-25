

import { API_BASE_URL } from '../_constants/api-constants';
import { BookSearchDto } from '../_model/dto/book-search-dto';

export const LibraryService = {
    async bookSearch(payload: BookSearchDto): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/librarys/search-book`, {
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
                throw new Error(result.data?.message || 'Failed to search book');
            }
        } catch (error) {
            console.error('Error searching book:', error);
            throw error;
        }
    },
};


