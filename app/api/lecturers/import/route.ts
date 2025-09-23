import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain at least a header and one data row' },
        { status: 400 }
      );
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    const requiredFields = ['name', 'position', 'credentials', 'bio', 'specialization', 'category', 'subjects'];
    
    // Validate headers
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const lecturers = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const lecturer: any = {};
      headers.forEach((header, index) => {
        lecturer[header] = values[index];
      });

      // Validate required fields
      const missingData = requiredFields.filter(field => !lecturer[field]);
      if (missingData.length > 0) {
        errors.push(`Row ${i + 1}: Missing data for ${missingData.join(', ')}`);
        continue;
      }

      // Validate category
      if (!['criminology', 'nursing', 'cpd'].includes(lecturer.category.toLowerCase())) {
        errors.push(`Row ${i + 1}: Invalid category. Must be criminology, nursing, or cpd`);
        continue;
      }

      lecturer.category = lecturer.category.toLowerCase();
      lecturer.photo = '/default-lecturer.svg'; // Default photo
      
      lecturers.push(lecturer);
    }

    if (errors.length > 0 && lecturers.length === 0) {
      return NextResponse.json(
        { error: 'Import failed', details: errors },
        { status: 400 }
      );
    }

    // Import valid lecturers
    let imported = 0;
    for (const lecturer of lecturers) {
      try {
        await prisma.lecturer.create({
          data: lecturer
        });
        imported++;
      } catch (error) {
        errors.push(`Failed to import ${lecturer.name}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      total: lecturers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed' },
      { status: 500 }
    );
  }
}