import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionCode = searchParams.get('regionCode');
    
    if (!regionCode) {
      return NextResponse.json([], { status: 400 });
    }
    
    const response = await fetch(`https://psgc.vercel.app/api/region/${regionCode}/province`);
    const data = await response.json();
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      // Return default provinces for Region VI
      if (regionCode === 'R6') {
        return NextResponse.json([
          { code: 'PH060400000', name: 'Capiz', regionCode: 'R6' },
          { code: 'PH060500000', name: 'Iloilo', regionCode: 'R6' },
          { code: 'PH060600000', name: 'Negros Occidental', regionCode: 'R6' },
          { code: 'PH060200000', name: 'Antique', regionCode: 'R6' },
          { code: 'PH060300000', name: 'Aklan', regionCode: 'R6' },
          { code: 'PH061900000', name: 'Guimaras', regionCode: 'R6' }
        ]);
      }
      return NextResponse.json([]);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    // Return empty array on error
    return NextResponse.json([]);
  }
}