let accessTokenInMemory: string | null = null;

const REFRESH_TOKEN_COOKIE = "refreshToken";

export const tokenManager = {
  getAccessToken(): string | null {
    return accessTokenInMemory;
  },

  getRefreshToken(): string | null {
    return this.getCookie(REFRESH_TOKEN_COOKIE);
  },

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  },

  setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // In production, add: Secure; SameSite=Strict; HttpOnly
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  },

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch("http://localhost:8000/access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Something went wrong");
      }

      const token = await response.json();
      accessTokenInMemory = token;
      return this.getAccessToken();
    } catch (error) {
      // If refresh fails, clear all tokens
      this.clearTokens();
      throw error;
    }
  },
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  },
  clearTokens() {
    // Clear access token from memory
    accessTokenInMemory = null;

    // Clear refresh token cookie
    this.deleteCookie(REFRESH_TOKEN_COOKIE);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    // Store access token in memory
    accessTokenInMemory = accessToken;

    // Store refresh token in httpOnly-like cookie (secure in production)
    this.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, 7); // 7 days
  },
};
