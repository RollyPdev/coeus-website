import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceCode = searchParams.get('provinceCode');
    
    if (!provinceCode) {
      return NextResponse.json([], { status: 400 });
    }
    
    const response = await fetch(`https://psgc.vercel.app/api/province/${provinceCode}/municipality`);
    const data = await response.json();
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      // Return default municipalities for Capiz
      if (provinceCode === 'PH060400000') {
        return NextResponse.json([
          { code: 'PH060401000', name: 'Roxas City', provinceCode: 'PH060400000' },
          { code: 'PH060402000', name: 'Cuartero', provinceCode: 'PH060400000' },
          { code: 'PH060403000', name: 'Dao', provinceCode: 'PH060400000' },
          { code: 'PH060404000', name: 'Dumalag', provinceCode: 'PH060400000' },
          { code: 'PH060405000', name: 'Dumarao', provinceCode: 'PH060400000' },
          { code: 'PH060406000', name: 'Ivisan', provinceCode: 'PH060400000' },
          { code: 'PH060407000', name: 'Jamindan', provinceCode: 'PH060400000' },
          { code: 'PH060408000', name: 'Ma-ayon', provinceCode: 'PH060400000' },
          { code: 'PH060409000', name: 'Mambusao', provinceCode: 'PH060400000' },
          { code: 'PH060410000', name: 'Panay', provinceCode: 'PH060400000' },
          { code: 'PH060411000', name: 'Panitan', provinceCode: 'PH060400000' },
          { code: 'PH060412000', name: 'Pilar', provinceCode: 'PH060400000' },
          { code: 'PH060413000', name: 'Pontevedra', provinceCode: 'PH060400000' },
          { code: 'PH060414000', name: 'President Roxas', provinceCode: 'PH060400000' },
          { code: 'PH060415000', name: 'Sapian', provinceCode: 'PH060400000' },
          { code: 'PH060416000', name: 'Sigma', provinceCode: 'PH060400000' },
          { code: 'PH060417000', name: 'Tapaz', provinceCode: 'PH060400000' }
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