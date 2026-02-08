// Authentication hook for managing user state
import { useState, useEffect } from 'react';
import { User } from '../lib/types';
import { authenticateUser, logoutUser, getCurrentUser, getAuthToken, removeAuthToken } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setAuthState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: (error as Error).message,
          isAuthenticated: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await authenticateUser('', email, password, false); // note: first param is empty string for login
      const user = await getCurrentUser();
      setAuthState({
        user: user || null,
        loading: false,
        error: null,
        isAuthenticated: !!user,
      });
      return response;
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: (error as Error).message,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await authenticateUser(name, email, password, true); // isSignup = true
      const user = await getCurrentUser();
      setAuthState({
        user: user || null,
        loading: false,
        error: null,
        isAuthenticated: !!user,
      });
      return response;
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: (error as Error).message,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const logout = async () => {
    setAuthState({ ...authState, loading: true });
    try {
      await logoutUser();
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      removeAuthToken();
      setAuthState({
        user: null,
        loading: false,
        error: (error as Error).message,
        isAuthenticated: false,
      });
    }
  };

  const refreshUser = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user: user || null,
        isAuthenticated: !!user,
      }));
    } catch {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    refreshUser,
  };
};

export default useAuth;
