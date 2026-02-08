// Mock API route for getting user profile
// This is needed for the getCurrentUser function in lib/auth.ts

import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers: Record<string, { id: string; email: string; password: string; name?: string }> = {
  '1': {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Test User'
  }
};

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    if (pathname.endsWith('/api/auth/me')) {
      // Check if user is authenticated by checking the authorization header
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
        const user = mockUsers[payload.sub];

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
    console.error('Auth/me API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}