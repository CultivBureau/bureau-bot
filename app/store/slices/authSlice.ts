import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DecodedToken {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  user_id?: string | number;
  email?: string;
  username?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  decodedToken: DecodedToken | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  decodedToken: null,
  isAuthenticated: false,
};

// Helper function to decode JWT token
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (error) {
    return null;
  }
};

// Helper function to check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // Consider token expired if it expires within the next 5 seconds (buffer)
  return currentTime >= (expirationTime - 5000);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.decodedToken = decodeToken(action.payload.token);
      state.isAuthenticated = true;
      
      // Also persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.decodedToken = decodeToken(action.payload);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload);
      }
    },
    clearTokens: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.decodedToken = null;
      state.isAuthenticated = false;
      
      // Also clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    },
    initializeAuth: (state) => {
      // Initialize from localStorage on app start
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token && refreshToken) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            // Clear expired tokens
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            return;
          }
          
          state.token = token;
          state.refreshToken = refreshToken;
          state.decodedToken = decodeToken(token);
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setTokens, updateAccessToken, clearTokens, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

