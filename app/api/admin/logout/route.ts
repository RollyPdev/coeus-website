import { NextResponse } from 'next/server';

export async function POST() {
  // This endpoint can be used for server-side logout if needed
  // Currently, logout is handled client-side by removing the token
  return NextResponse.json({ message: 'Logged out successfully' });
}
