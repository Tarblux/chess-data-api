import { db } from '@/app/db/client';
import { chessProfile } from '@/app/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// POST /api/profile - Create/Update my profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create or update the profile
    const [profile] = await db
      .insert(chessProfile)
      .values({
        id: 'BlunderRasta',
        username: 'BlunderRasta',
        name: body.name || null,
        title: body.title || null,
        country: body.country || null,
        location: body.location || null,
        bio: body.bio || null,
        avatar: body.avatar || null,
        rawData: body.rawData || null,
      })
      .onConflictDoUpdate({
        target: chessProfile.id,
        set: {
          name: body.name || null,
          title: body.title || null,
          country: body.country || null,
          location: body.location || null,
          bio: body.bio || null,
          avatar: body.avatar || null,
          rawData: body.rawData || null,
          lastUpdated: new Date(),
        },
      })
      .returning();

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create/update profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/profile - Get my profile
export async function GET() {
  try {
    const [profile] = await db
      .select()
      .from(chessProfile)
      .where(eq(chessProfile.id, 'BlunderRasta'));

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 