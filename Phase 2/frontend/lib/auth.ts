// lib/auth.ts
'use client';

export interface UserData {
  id: number | string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// -------------------- SIGNUP --------------------
export const signUpUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: UserData; token: string }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-up`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include', // ensures cookies are sent/received
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
};

// -------------------- LOGIN / AUTHENTICATE --------------------
export const authenticateUser = async (
  nameOrEmpty: string,
  email: string,
  password: string,
  isSignup: boolean = false
): Promise<{ user: UserData; token: string }> => {
  try {
    const endpoint = isSignup ? 'sign-up' : 'sign-in';
    const body: any = isSignup ? { name: nameOrEmpty, email, password } : { email, password };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${endpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'Authentication failed');
    }

    const data = await response.json();

    // Save token in localStorage
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth-token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// -------------------- LOGOUT --------------------
export const logoutUser = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// -------------------- GET CURRENT USER --------------------
export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      removeAuthToken();
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// -------------------- TOKEN HELPERS --------------------
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
};
