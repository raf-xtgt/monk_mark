


import { UserService } from './user-service';
import { UserStateDto } from '../model/dto/user-state-dto';

const STORAGE_KEYS = {
    USER_GUID: 'UserStateDto.guid',
    USER_NAME: 'UserStateDto.userName',
    USER_EMAIL: 'UserStateDto.email',
};

export const SessionService = {
    async getOrCreateUser(payload: { email: string }): Promise<UserStateDto> {
        try {
            // Check localStorage for existing user
            const storedGuid = localStorage.getItem(STORAGE_KEYS.USER_GUID);
            const storedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
            const storedEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);

            if (storedGuid && storedUserName && storedEmail) {
                // User exists in localStorage
                const userState: UserStateDto = {
                    guid: storedGuid,
                    userName: storedUserName,
                    email: storedEmail,
                };
                return userState;
            }

            // User doesn't exist, create new one
            const createdUser = await UserService.autoCreateDefaultUser({
                email: payload.email,
            });

            // Generate userName from guid
            const userName = `test-user-${createdUser.guid.substring(0, 5)}`;

            const userState: UserStateDto = {
                guid: createdUser.guid,
                userName: userName,
                email: createdUser.email,
            };

            // Store in localStorage
            localStorage.setItem(STORAGE_KEYS.USER_GUID, userState.guid);
            localStorage.setItem(STORAGE_KEYS.USER_NAME, userState.userName);
            localStorage.setItem(STORAGE_KEYS.USER_EMAIL, userState.email);

            return userState;
        } catch (error) {
            console.error('Error in getOrCreateUser:', error);
            throw error;
        }
    },
};


