import { FocusSessionDto } from "../_model/dto/focus-session-dto";
import { API_BASE_URL } from '../_constants/api-constants';

export const FocusSessionService = {
    async getExistingFocusSession(payload: { userGuid: string }): Promise<FocusSessionDto | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/focus-sessions/get-by-criteria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_guid: payload.userGuid,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'OK_RESPONSE' && result.data && result.data.length > 0) {
                const session = result.data[0];
                return {
                    userGuid: session.user_guid,
                    focusSessionGuid: session.guid,
                    libraryHdrGuid: session.library_hdr_guid,
                    bookName: session.book_name || '',
                    coverImageUrl: session.cover_image_url || '',
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting existing focus session:', error);
            throw error;
        }
    },
};


