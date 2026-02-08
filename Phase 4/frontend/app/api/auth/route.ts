// API route for authentication endpoints

import { NextRequest, NextResponse } from 'next/server';

// This is a mock authentication API for demonstration purposes
// In a real application, this would connect to your backend authentication service

// Mock user database
const mockUsers: Record<string, { id: string; email: string; password: string; name?: string }> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // In real app, this would be hashed
    name: 'Test User'
  }
};

// Helper function to generate a simple JWT-like token (for demo purposes only)
function generateToken(userId: string, email: string) {
  const payload = {
    sub: userId,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };

  // This is not a real JWT - just for demonstration
  return btoa(JSON.stringify(payload));
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    const pathname = request.nextUrl.pathname;

    if (pathname.endsWith('/api/auth/sign-up')) {
      // Mock sign up
      if (mockUsers[email]) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In real app, hash the password
        name
      };
      mockUsers[email] = newUser;

      const token = generateToken(newUser.id, newUser.email);

      return NextResponse.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        },
        token
      });
    } else if (pathname.endsWith('/api/auth/sign-in')) {
      // Mock sign in
      const user = mockUsers[email];

      if (!user || user.password !== password) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = generateToken(user.id, user.email);

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } else if (pathname.endsWith('/api/auth/sign-out')) {
      // Mock sign out - just return success
      return NextResponse.json({
        message: 'Successfully signed out'
      });
    } else if (pathname.endsWith('/api/auth/me')) {
      // Mock get user profile
      const authHeader = request.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { message: 'Authorization header required' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // In a real app, you would verify the JWT here
      try {
        const payload = JSON.parse(atob(token));
        const user = Object.values(mockUsers).find(u => u.id === payload.sub);

        if (!user) {
          return NextResponse.json(
            { message: 'User not found' },
            { status: 401 }
          );
        }

        return NextResponse.json({
          id: user.id,
          email: user.email,
          name: user.name
        });
      } catch (error) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Invalid endpoint' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}