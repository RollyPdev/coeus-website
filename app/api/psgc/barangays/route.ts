import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipalityCode = searchParams.get('municipalityCode');
    
    if (!municipalityCode) {
      return NextResponse.json([], { status: 400 });
    }
    
    const response = await fetch(`https://psgc.vercel.app/api/municipality/${municipalityCode}/barangay`);
    const data = await response.json();
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      // Return default barangays for Roxas City
      if (municipalityCode === 'PH060401000') {
        return NextResponse.json([
          { code: 'PH060401001', name: 'Balijuagan', municipalityCode: 'PH060401000' },
          { code: 'PH060401002', name: 'Banica', municipalityCode: 'PH060401000' },
          { code: 'PH060401003', name: 'Bolo', municipalityCode: 'PH060401000' },
          { code: 'PH060401004', name: 'Culajao', municipalityCode: 'PH060401000' },
          { code: 'PH060401005', name: 'Punta Tabuc', municipalityCode: 'PH060401000' },
          { code: 'PH060401006', name: 'Tiza', municipalityCode: 'PH060401000' },
          { code: 'PH060401007', name: 'Baybay', municipalityCode: 'PH060401000' }
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