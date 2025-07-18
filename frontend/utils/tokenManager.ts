let accessTokenInMemory: string | null = null

const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const tokenManager = {
    getAccessToken(): string | null {
        return accessTokenInMemory
    },

    getRefreshToken(): string | null {

        return this.getCookie(REFRESH_TOKEN_COOKIE)
    },

    getCookie(name: string): string | null {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
    },

    async refreshAccessToken(): Promise<string> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await mockApi.refreshToken(refreshToken);
            accessTokenInMemory = response.accessToken;
            return response.accessToken;
        } catch (error) {
            // If refresh fails, clear all tokens
            this.clearTokens();
            throw error;
        }
    },

}