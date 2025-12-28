const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

export const tokenStore = {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  },

  setTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },
};
