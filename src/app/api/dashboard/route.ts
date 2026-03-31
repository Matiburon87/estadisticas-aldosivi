import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Intentar importar Prisma dinámicamente (puede no estar disponible en serverless)
    const { db } = await import("@/lib/db");

    const matches = await db.match.findMany({
      include: { squadStat: true },
      orderBy: { fecha: "desc" },
      take: 10
    });

    const players = await db.player.findMany({
      include: { matchStats: true }
    });

    let totalGoals = 0, totalMatches = matches.length, totalPossession = 0;

    matches.forEach(m => {
      if (m.squadStat) {
        totalGoals += m.squadStat.goles || 0;
        totalPossession += m.squadStat.posesion || 0;
      }
    });

    const averagePossession = totalMatches > 0 ? (totalPossession / totalMatches).toFixed(1) : "0";
    const averageGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : "0";

    return NextResponse.json({
      success: true,
      data: {
        rawMatches: matches,
        summary: {
          golesTotales: totalGoals,
          promedioPosesion: averagePossession,
          golesPorPartido: averageGoals,
          partidosJugados: totalMatches,
        },
        players: players
      }
    });
  } catch (error) {
    // En entornos sin DB (Netlify), retornar datos vacíos — el frontend usa datos estáticos
    console.warn("Dashboard API: DB no disponible, retornando datos vacíos.", error);
    return NextResponse.json({
      success: true,
      data: {
        rawMatches: [],
        summary: {
          golesTotales: 0,
          promedioPosesion: "0",
          golesPorPartido: "0",
          partidosJugados: 0,
        },
        players: []
      }
    });
  }
}
