import { NextRequest, NextResponse } from 'next/server';

// Simple login without external dependencies
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simple hardcoded admin credentials for now
    const validCredentials = [
      { email: 'admin@coeus.com', password: 'admin123' },
      { email: 'coeus@admin.com', password: 'admin123' }
    ];

    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple token (base64 encoded email + timestamp)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}