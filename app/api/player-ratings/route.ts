import { NextResponse } from 'next/server';
import axios from 'axios';

const CHESS_API_BASE = 'https://api.chess.com/pub';
const USERNAME = 'BlunderRasta';

export async function GET() {
  try {
    const response = await axios.get(`${CHESS_API_BASE}/player/${USERNAME}/stats`);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch player ratings/stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 