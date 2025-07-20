import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://psgc.vercel.app/api/region');
    const data = await response.json();
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      // Return default regions if API doesn't return an array
      return NextResponse.json([
        { code: 'NCR', name: 'National Capital Region' },
        { code: 'CAR', name: 'Cordillera Administrative Region' },
        { code: 'R1', name: 'Region I: Ilocos Region' },
        { code: 'R2', name: 'Region II: Cagayan Valley' },
        { code: 'R3', name: 'Region III: Central Luzon' },
        { code: 'R4A', name: 'Region IV-A: CALABARZON' },
        { code: 'R4B', name: 'Region IV-B: MIMAROPA' },
        { code: 'R5', name: 'Region V: Bicol Region' },
        { code: 'R6', name: 'Region VI: Western Visayas' },
        { code: 'R7', name: 'Region VII: Central Visayas' },
        { code: 'R8', name: 'Region VIII: Eastern Visayas' },
        { code: 'R9', name: 'Region IX: Zamboanga Peninsula' },
        { code: 'R10', name: 'Region X: Northern Mindanao' },
        { code: 'R11', name: 'Region XI: Davao Region' },
        { code: 'R12', name: 'Region XII: SOCCSKSARGEN' },
        { code: 'R13', name: 'Region XIII: Caraga' },
        { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' }
      ]);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    // Return default regions on error
    return NextResponse.json([
      { code: 'NCR', name: 'National Capital Region' },
      { code: 'CAR', name: 'Cordillera Administrative Region' },
      { code: 'R1', name: 'Region I: Ilocos Region' },
      { code: 'R2', name: 'Region II: Cagayan Valley' },
      { code: 'R3', name: 'Region III: Central Luzon' },
      { code: 'R4A', name: 'Region IV-A: CALABARZON' },
      { code: 'R4B', name: 'Region IV-B: MIMAROPA' },
      { code: 'R5', name: 'Region V: Bicol Region' },
      { code: 'R6', name: 'Region VI: Western Visayas' },
      { code: 'R7', name: 'Region VII: Central Visayas' },
      { code: 'R8', name: 'Region VIII: Eastern Visayas' },
      { code: 'R9', name: 'Region IX: Zamboanga Peninsula' },
      { code: 'R10', name: 'Region X: Northern Mindanao' },
      { code: 'R11', name: 'Region XI: Davao Region' },
      { code: 'R12', name: 'Region XII: SOCCSKSARGEN' },
      { code: 'R13', name: 'Region XIII: Caraga' },
      { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' }
    ]);
  }
}