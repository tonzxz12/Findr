import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Since we're using client-side storage (localStorage) for session management,
    // the logout is primarily handled on the frontend.
    // This endpoint can be used for server-side cleanup if needed.
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
