import { NextResponse } from 'next/server';
import axios from 'axios';

const CHESS_API_BASE = 'https://api.chess.com/pub';
const USERNAME = 'BlunderRasta';

function getLast48hTimestamps() {
  const now = Math.floor(Date.now() / 1000);
  const fortyEightHoursAgo = now - 98 * 60 * 60;
  return { now, fortyEightHoursAgo };
}

export async function GET() {
  try {
    // 1. Get archives
    const archivesRes = await axios.get(`${CHESS_API_BASE}/player/${USERNAME}/games/archives`);
    const archives = archivesRes.data.archives;
    if (!archives || !Array.isArray(archives) || archives.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. Determine which archives to fetch (this month and possibly last month)
    const { now, fortyEightHoursAgo } = getLast48hTimestamps();
    const nowDate = new Date(now * 1000);
    const lastMonthDate = new Date(nowDate);
    lastMonthDate.setMonth(nowDate.getMonth() - 1);
    const thisMonthStr = `${nowDate.getFullYear()}/${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthStr = `${lastMonthDate.getFullYear()}/${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    // Find archive URLs for this month and last month
    const relevantArchives = archives.filter((url) =>
      url.endsWith(thisMonthStr) || url.endsWith(lastMonthStr)
    );

    // 3. Fetch games from relevant archives
    let games: unknown[] = [];
    for (const archiveUrl of relevantArchives) {
      const res = await axios.get(archiveUrl);
      if (res.data && Array.isArray(res.data.games)) {
        games = games.concat(res.data.games);
      }
    }

    // 4. Filter games by end_time in last 48 hours
    const recentGames = games.filter((game) => {
      const g = game as Record<string, unknown>;
      return (
        typeof g.end_time === 'number' &&
        g.end_time >= fortyEightHoursAgo &&
        g.end_time <= now
      );
    });

    return NextResponse.json(recentGames);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
} 