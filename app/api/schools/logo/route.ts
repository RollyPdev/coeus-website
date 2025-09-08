import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolName = searchParams.get('school');
    
    if (!schoolName) {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }
    
    const school = schoolName.toLowerCase();
    let logoUrl = null;
    
    // Capiz State University campuses
    if (school.includes('capiz state university')) {
      logoUrl = 'https://admission.capsu.edu.ph/storage/avatars/default_logo.jpg';
    }
    // Hercor College
    else if (school.includes('hercor college')) {
      logoUrl = 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/l2jKhAf1ncxayoDfVTUh/media/686c1c4d499f7465d6a356e6.svg';
    }
    // Northern Iloilo State University (all campuses)
    else if (school.includes('northern iloilo state university') || 
             school.includes('nisu') ||
             school.includes('northern iloilo') ||
             school.includes('nisu - estancia') ||
             school.includes('nisu - ajuy') ||
             school.includes('nisu - batad') ||
             school.includes('nisu - concepcion') ||
             school.includes('nisu - lemery') ||
             school.includes('nisu - san dionisio') ||
             school.includes('nisu - sara') ||
             school.includes('nisu - balasan')) {
      logoUrl = 'https://nisu.pinnacle.com.ph/ajuy/images/NISU_Logo.jpg';
    }
    
    if (logoUrl) {
      return NextResponse.json({ logoUrl, schoolName });
    } else {
      return NextResponse.json({ logoUrl: null, schoolName });
    }
  } catch (error) {
    console.error('Error fetching school logo:', error);
    return NextResponse.json({ error: 'Failed to fetch school logo' }, { status: 500 });
  }
}