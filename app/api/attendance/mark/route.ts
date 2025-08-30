import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Review center coordinates - 11°34'27.2"N 122°44'41.9"E
const REVIEW_CENTER_LAT = 11.574222;
const REVIEW_CENTER_LNG = 122.744972;
const ALLOWED_RADIUS = process.env.NODE_ENV === 'development' ? 50000 : 1000; // 50km for dev, 1km for prod
const BYPASS_LOCATION = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_BYPASS_LOCATION === 'true';

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function isWithinAllowedArea(userLat: number, userLng: number) {
  const distance = calculateDistance(
    userLat, userLng,
    REVIEW_CENTER_LAT, REVIEW_CENTER_LNG
  );
  return distance <= ALLOWED_RADIUS;
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, location, method } = await request.json();
    
    if (!studentId || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify location (bypass in development or when explicitly set)
    if (!BYPASS_LOCATION && !isWithinAllowedArea(location.lat, location.lng)) {
      return NextResponse.json(
        { error: 'You must be within the review center premises to mark attendance' },
        { status: 403 }
      );
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        status: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    if (student.status !== 'active') {
      return NextResponse.json(
        { error: 'Student account is not active' },
        { status: 403 }
      );
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Check if attendance already exists for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already marked for today' },
        { status: 409 }
      );
    }

    // Determine status based on time
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Assuming classes start at 8:00 AM (480 minutes from midnight)
    // Late if after 8:15 AM (495 minutes from midnight)
    const classStartTime = 8 * 60; // 8:00 AM
    const lateThreshold = 8 * 60 + 15; // 8:15 AM
    
    let status = 'present';
    if (currentTime > lateThreshold) {
      status = 'late';
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date: today,
        status,
        remarks: `Marked via ${method} at ${today.toLocaleTimeString()}`
      },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Attendance marked successfully',
      attendance,
      status
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}