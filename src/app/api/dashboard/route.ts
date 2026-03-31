import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Aggregations to replace hardcoded data in page.tsx
    const matches = await db.match.findMany({
      include: {
        squadStat: true
      },
      orderBy: { fecha: "desc" },
      take: 10
    });

    const players = await db.player.findMany({
      include: {
        matchStats: true
      }
    });

    // Compute basic aggregates if matches exist
    let totalGoals = 0, totalMatches = matches.length, totalPossession = 0;
    
    matches.forEach(m => {
      if (m.squadStat) {
        totalGoals += m.squadStat.goles || 0;
        totalPossession += m.squadStat.posesion || 0;
      }
    });

    const averagePossession = totalMatches > 0 ? (totalPossession / totalMatches).toFixed(1) : "0";
    const averageGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : "0";

    const dashboardSummary = {
      golesTotales: totalGoals,
      promedioPosesion: averagePossession,
      golesPorPartido: averageGoals,
      partidosJugados: totalMatches,
    };

    return NextResponse.json({
      success: true,
      data: {
        rawMatches: matches,
        summary: dashboardSummary,
        players: players
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
