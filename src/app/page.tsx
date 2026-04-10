'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { 
  TrendingDown, TrendingUp, Users, DollarSign, Target, Shield, 
  AlertTriangle, Activity, Goal, Clock, MapPin, Calendar, Trophy, 
  AlertCircle, CheckCircle, XCircle, UserCheck, Award, Zap,
  Globe, ExternalLink, Newspaper, ShoppingBag, Briefcase
} from 'lucide-react'
import { UploadButton } from '@/components/UploadButton'


// Datos del Club Aldosivi — fuente verificada: PDFs de análisis FM 2026
const clubData = {
  nombre: "Club Atlético Aldosivi",
  ciudad: "Mar del Plata, Argentina",
  fundacion: 1913,
  estadio: "José María Minella",
  capacidad: 35180,
  capacidadOperativa: 20000,
  valorPlantilla: 8.68, // millones de euros — fuente PDF
  jugadores: 31,
  extranjeros: 5, // 16.1% de la nómina
  balanceTransferencias: 2.56, // saldo positivo (salidas > compras)
  edadMedia: 26.5, // entre 25.6 y 27.5 según inclusión de reserva
  dtInterino: "Israel Damonte",
  dtSaliente: "Guillermo Martín Farré",
  posicionAnual: 29,   // posición en tabla anual 2026
  posicionLiga: 28,    // posición en tabla de promedios
  calificacion: 6.61,  // calificación algorítmica media
  promedioDescenso: 0.886,
  puntos: 6,           // pts tabla anual 2026 (6 empates en 12 PJ de liga)
  ptsPromedioHistorico: 39, // pts acumulados en sistema de promedios (44 PJ)
  pjPromedioHistorico: 44,  // 42 históricos + 2 nuevos liga (sin Copa Argentina)
  partidosJugados: 12, // PJ liga 2026 (sin Copa Argentina). Actualizado al 04/04
  diferenciaGol: -10,  // DG liga: GF=3, GC=13 en 12 PJ
  xG: 5.4,             // goles esperados temporada
  fallasPorPJ: 14.8,   // recalculado sobre 12 PJ de liga
  posesionMedia: 49.8  // recalculado 12 PJ liga: ((50×10)+47+51)/12
}

// Métricas de rendimiento — fuente: PDF "Centro de Datos FM 2026" y "Informe de Inteligencia Deportiva"
// Métricas actualizadas al 04/04/2026 (13 PJ en total, 12 de liga + 1 Copa)
// Fuente: PDF auditoría (10 PJ corregidos via fichajes.com) + partidos reales 31/03 y 04/04
const metricsData = [
  { metrica: "Goles/Partido", valor: 0.25, liga: 1.00, ranking: "29º", status: "critical", evaluacion: "Crítico", lider: "Independiente R. (1.6)", nota: "3 goles en 12 PJ liga" },
  { metrica: "Tiros a Puerta/PJ", valor: 3.0, liga: 3.80, ranking: "27º", status: "warning", evaluacion: "Mejorando", lider: "Arg. Jrs (6.3)", nota: "(19+6+11)/12 PJ liga" },
  { metrica: "xG (Goles Esp.)", valor: 5.4, liga: 9.8, ranking: "28º", status: "critical", evaluacion: "Crítico", lider: "Unión (14.6)", nota: "Dato 10 PJ (no verificable)" },
  { metrica: "Posesión Media %", valor: 49.8, liga: 49.4, ranking: "15º", status: "warning", evaluacion: "Promedio", lider: "River (65%)", nota: "Recalc. 12 PJ liga" },
  { metrica: "Precisión Pases %", valor: 73, liga: 74.9, ranking: "20º", status: "warning", evaluacion: "Aceptable", lider: "Boca / River (83%)", nota: "Corregido vs imagen" },
  { metrica: "Pases Precisos/PJ", valor: 267, liga: 310, ranking: "16º", status: "warning", evaluacion: "Aceptable", lider: "Arg. Jrs (407)", nota: "Dato 10 PJ" },
  { metrica: "Duelos Ganados %", valor: 54.0, liga: 52.8, ranking: "15º", status: "warning", evaluacion: "Competitivo", lider: "Banfield (59.3)", nota: "Corregido: era #8° erróneo" },
  { metrica: "Entradas Ganadas", valor: 12.2, liga: 10.7, ranking: "5º", status: "good", evaluacion: "Excelente", lider: "-", nota: "" },
  { metrica: "Faltas/Partido", valor: 14.8, liga: 12.4, ranking: "4º", status: "critical", evaluacion: "Alarmante", lider: "-", nota: "15 faltas vs Est.RC (+roja Zalazar)" },
  { metrica: "Goles Concedidos/PJ", valor: 1.1, liga: 1.0, ranking: "12º", status: "warning", evaluacion: "Regular", lider: "Platense (0.4)", nota: "GC=13 en 12 PJ liga" },
  { metrica: "Porterías a Cero", valor: 4, liga: 3, ranking: "7º", status: "good", evaluacion: "Competitivo", lider: "-", nota: "+1 vs Est.RC (0-0)" },
  { metrica: "Grandes Ocasiones", valor: 3, liga: 8, ranking: "30º", status: "critical", evaluacion: "Crítico", lider: "Unión (23)", nota: "Dato 10 PJ (no verificable)" }
]

// Datos para gráfico de radar — actualizados con valores reales del PDF
const radarData = [
  { categoria: "Ataque", Aldosivi: 20, Liga: 60 },
  { categoria: "Defensa", Aldosivi: 62, Liga: 58 },
  { categoria: "Posesión", Aldosivi: 50, Liga: 50 },
  { categoria: "Finalización", Aldosivi: 12, Liga: 55 },
  { categoria: "Físico", Aldosivi: 70, Liga: 50 },
  { categoria: "Duelos", Aldosivi: 54, Liga: 53 }
]

// Datos comparativos con otros equipos
const comparisonData = [
  { name: "Aldosivi", goles: 0.23, tiros: 2.25, posesion: 49.8 },
  { name: "Independiente R. (Líder Goles)", goles: 1.6, tiros: 4.6, posesion: 42 },
  { name: "Unión (Líder xG)", goles: 1.5, tiros: 4.8, posesion: 55 },
  { name: "River (Líder Posesión)", goles: 1.4, tiros: 5.7, posesion: 65 }
]

// Tabla de Promedios de Descenso
const promediosData = [
  { puesto: 25, equipo: "Newell's", promedio: 1.071, pj: 85, pts: 91, estado: "seguro" },
  { puesto: 26, equipo: "Banfield", promedio: 1.047, pj: 85, pts: 89, estado: "alerta" },
  { puesto: 27, equipo: "Sarmiento", promedio: 1.012, pj: 85, pts: 86, estado: "peligro" },
  { puesto: 28, equipo: "Gimnasia (M)", promedio: 1.000, pj: 12, pts: 12, estado: "peligro" },
  { puesto: 29, equipo: "Aldosivi", promedio: 0.886, pj: 44, pts: 39, estado: "critico" },
  { puesto: 30, equipo: "Estudiantes RC", promedio: 0.417, pj: 12, pts: 5, estado: "descenso" }
]

// Tabla Anual de Descenso (General) - 2026 en curso (~10-11 fechas)
// Tabla Anual actualizada al 04/04/2026 (Fecha 12 de liga jugada)
const tablaAnualData = [
  { puesto: 25, equipo: "Banfield", pj: 12, difGol: -3, pts: 11, estado: "seguro" },
  { puesto: 26, equipo: "Atlético Tucumán", pj: 12, difGol: -4, pts: 9, estado: "alerta" },
  { puesto: 27, equipo: "Newell's", pj: 12, difGol: -5, pts: 9, estado: "peligro" },
  { puesto: 28, equipo: "Dep. Riestra", pj: 12, difGol: -6, pts: 7, estado: "peligro" },
  { puesto: 29, equipo: "Aldosivi", pj: 12, difGol: -10, pts: 6, estado: "critico" },
  { puesto: 30, equipo: "Estudiantes RC", pj: 12, difGol: -10, pts: 5, estado: "descenso" }
]

// Jugadores con datos biométricos verificados (fuente: PDFs de análisis FM 2026)
const jugadoresDestacados = [
  { nombre: "Axel Werner", posicion: "Portero", edad: 30, altura: "1.92m", peso: "85kg", rating: 6.5, partidos: 6, minutos: 540, golesConcedidos: 6, key: true, perfil: "Envergadura / Derecha" },
  { nombre: "Sebastián Moyano", posicion: "Portero", edad: 35, altura: "1.88m", rating: 6.0, partidos: 2, key: false, perfil: "Veterano / Líder vestuario" },
  { nombre: "Ignacio Chicco", posicion: "Portero", edad: 29, altura: "1.84m", peso: "81kg", rating: 6.1, partidos: 2, key: false, perfil: "Ágil / Izquierda" },
  { nombre: "Joaquín Novillo", posicion: "Defensa Central", edad: 28, altura: "1.90m", peso: "86kg", rating: 6.4, goles: 1, partidos: 9, key: true, perfil: "Central Zurdo" },
  { nombre: "Nicolás Zalazar", posicion: "Defensa Central", edad: 29, altura: "1.85m", peso: "80kg", rating: 6.8, partidos: 9, key: true, perfil: "Central / Derecha" },
  { nombre: "Santiago Moya", posicion: "Defensa Central", edad: 22, altura: "1.87m", peso: "80kg", rating: 6.2, partidos: 6, key: false, perfil: "Potente / Derecha" },
  { nombre: "Néstor Breitenbruch", posicion: "Defensa", edad: 30, altura: "1.78m", rating: 6.0, partidos: 4, key: false, perfil: "Polivalente / Central o Flanco" },
  { nombre: "Emanuel Iñíguez", posicion: "Lateral Der.", edad: 29, altura: "1.77m", rating: 5.9, partidos: 8, key: false, perfil: "Lateral Defensivo" },
  { nombre: "Fernando Román", posicion: "Lateral Izq.", edad: 27, altura: "1.80m", rating: 6.0, partidos: 7, key: false, perfil: "Lateral Defensivo" },
  { nombre: "Roberto Bochi", posicion: "Mediocampista", edad: 38, altura: "1.75m", rating: 5.8, partidos: 8, key: false, perfil: "Recuperador (Obsoleto para transiciones)" },
  { nombre: "Esteban Rolón", posicion: "Mediocampista", edad: 30, altura: "1.75m", rating: 6.0, partidos: 7, key: false, perfil: "Pivote Defensivo" },
  { nombre: "Federico Gino", posicion: "Mediocampista", edad: 33, altura: "1.73m", rating: 6.3, goles: 1, partidos: 8, key: true, perfil: "Todoterreno / Capitán" },
  { nombre: "Tomás Fernández", posicion: "Delantero/Extremo", edad: 28, altura: "1.74m", rating: 6.6, goles: 1, asistencias: 1, partidos: 9, tarjetasAmarillas: 1, key: true, perfil: "Interior Ofensivo (Líder ofensivo del equipo)" },
  { nombre: "Natanael Guzmán", posicion: "Extremo", edad: 26, altura: "1.72m", rating: 6.2, partidos: 7, key: true, perfil: "Desequilibrio / Aceleración" },
  { nombre: "Facundo De la Vega", posicion: "Centrodelantero", edad: 22, altura: "1.91m", peso: "80kg", rating: 6.0, asistencias: 1, partidos: 5, key: true, perfil: "Alcance aéreo extremo (Subexplotado)" },
  { nombre: "Alejandro Villarreal", posicion: "Centrodelantero", edad: 20, altura: "1.89m", peso: "85kg", rating: 5.9, partidos: 4, key: true, perfil: "Potencia física" },
  { nombre: "Nicolás Cordero", posicion: "Centrodelantero", edad: 24, altura: "1.86m", rating: 6.1, partidos: 6, key: true, perfil: "Finalizador / Referencia de área" },
  { nombre: "Agustín Palavecino", posicion: "Extremo", edad: 23, altura: "1.85m", peso: "72kg", rating: 5.9, partidos: 5, key: false, perfil: "Buen pie, media distancia" },
  { nombre: "Junior Arias", posicion: "Delantero", edad: 32, altura: "1.76m", peso: "80kg", rating: 6.0, partidos: 7, key: false, perfil: "Pivotaje y técnica" }
]

// Partidos de la temporada — actualizado al 04/04/2026 (13 PJ)
const partidosData = [
  { fecha: "22/01", rival: "Defensa y Justicia", resultado: "0-0", tipo: "Local", competencia: "Liga", nota: "Empate conservador en debut" },
  { fecha: "28/01", rival: "Barracas Central", resultado: "0-0", tipo: "Local", competencia: "Liga", nota: "Rival directo por permanencia" },
  { fecha: "02/02", rival: "Gimnasia L.P.", resultado: "1-3", tipo: "Visitante", competencia: "Liga", nota: "Primera crisis severa — lentitud del mediocampo expuesta" },
  { fecha: "07/02", rival: "Rosario Central", resultado: "1-1", tipo: "Local", competencia: "Liga", nota: "Repliegue heroico vs equipo de alto xG (12.3)" },
  { fecha: "12/02", rival: "Tigre", resultado: "0-1", tipo: "Visitante", competencia: "Liga", nota: "0 remates — derrota previsible" },
  { fecha: "17/02", rival: "San Miguel", resultado: "3-0", tipo: "Local", competencia: "Copa Argentina", nota: "Rival de ascenso — anomalía estadística" },
  { fecha: "22/02", rival: "Unión Santa Fe", resultado: "0-1", tipo: "Visitante", competencia: "Liga", nota: "Líder en xG (14.6) — Werner evitó goleada" },
  { fecha: "02/03", rival: "Banfield", resultado: "0-2", tipo: "Visitante", competencia: "Liga", nota: "Pérdidas en zona ancha, transiciones rivales rápidas" },
  { fecha: "11/03", rival: "Atlético Tucumán", resultado: "1-1", tipo: "Visitante", competencia: "Liga", nota: "Gol igualador de Gino (min. 89). Farré usó repliegue total" },
  { fecha: "16/03", rival: "Huracán", resultado: "0-0", tipo: "Local", competencia: "Liga", nota: "Empate estéril en casa" },
  { fecha: "22/03", rival: "Sarmiento (J)", resultado: "0-2", tipo: "Visitante", competencia: "Liga", nota: "Derrota vs rival directo con 60 min en superioridad numérica" },
  { fecha: "31/03", rival: "Argentinos Jrs", resultado: "0-2", tipo: "Local", competencia: "Liga", nota: "Debut Damonte. Pos: 47% | 6 tiros. Goles: Morales (28') y R.Riquelme (37')" },
  { fecha: "04/04", rival: "Est. Río Cuarto", resultado: "0-0", tipo: "Local", competencia: "Liga", nota: "Empate con 10 desde min.?. Zalazar expulsado. 15 faltas. Algo mejor en ataque (11 tiros)" }
]

// Candidatos a Director Técnico
const candidatosDT = [
  {
    nombre: "Israel Damonte",
    edad: 44,
    perfil: "Estratégico",
    esquema: "4-4-2 Clásico",
    filosofia: "Táctica de guerrilla. Ultraconservador, reactivo, friccionado. Experto en pelota parada.",
    compatibilidad: 95,
    evaluacion: "CANDIDATO ÓPTIMO",
    status: "recomendado",
    fortalezas: ["Sistematiza la fricción", "Activa juego aéreo", "Perfecto para plantel rústico"],
    debilidades: ["Estilo poco vistoso"],
    detalle: "Su filosofía de 'guerrilla' explota las limitaciones del plantel como virtud. Maximizaría a delanteros altos como De la Vega (1.91m) y Cordero."
  },
  {
    nombre: "Mario Sciacqua",
    edad: 55,
    perfil: "Pragmático",
    esquema: "5-3-2 / 5-4-1",
    filosofia: "Bloque bajo impenetrable, contragolpes directos. Especialista en presiones competitivas.",
    compatibilidad: 85,
    evaluacion: "ALTAMENTE FAVORABLE",
    status: "favorable",
    fortalezas: ["Blinda defensivamente", "Doble nueve de área", "Explota transiciones"],
    debilidades: ["Exige despliegue físico alto en carrileros"],
    detalle: "Su 5-3-2 aprovecharía los tres centrales altos (Novillo, Zalazar, Moya) y liberaría a los delanteros de referencia."
  },
  {
    nombre: "Omar De Felippe",
    edad: 63,
    perfil: "Equilibrado",
    esquema: "4-4-2 / 4-2-3-1",
    filosofia: "Primero el arco propio. Experiencia en rescates de descenso. Pide audacia y asociación.",
    compatibilidad: 50,
    evaluacion: "MODERADAMENTE INCOMPATIBLE",
    status: "neutral",
    fortalezas: ["Gestión emocional", "Experiencia en descensos", "Liderazgo"],
    debilidades: ["Pide asociación que el plantel no puede dar", "Riesgo de pérdidas en zona crítica"],
    detalle: "Su filosofía de 'jugar y equivocarse' es veneno táctico para un plantel técnico limitado."
  },
  {
    nombre: "Néstor Gorosito",
    edad: 61,
    perfil: "Vistoso",
    esquema: "4-2-3-1 / 4-3-1-2",
    filosofia: "Fundamentalista del 'Enganche'. Trato pulcro del balón, triangulaciones cortas.",
    compatibilidad: 20,
    evaluacion: "ABSOLUTAMENTE INCOMPATIBLE",
    status: "descartado",
    fortalezas: ["Juego asociativo", "Experiencia"],
    debilidades: ["No hay perfiles creativos en plantel", "Desconecta a delanteros altos", "Historial irregular en descensos"],
    detalle: "La plantilla carece de organizadores adelantados. Su estilo rasante desperdiciaría el biotipo de los delanteros."
  }
]

// Próximos partidos — actualizado al 04/04/2026 (12 PJ de liga disputados)
const fixtureData = [
  { fecha: "10/04", rival: "Belgrano", tipo: "Visitante", dificultad: "Alta", recomendacion: "Bloque bajo sólido. Zalazar suspendido — cubrir con Moya o Breitenbruch" },
  { fecha: "19/04", rival: "Racing Club", tipo: "Local", dificultad: "Muy Alta", recomendacion: "Marcajes férreos sobre lanzadores. Sin margen de error" },
  { fecha: "25/04", rival: "River Plate", tipo: "Visitante", dificultad: "Muy Alta", recomendacion: "Repliegue total. Werner como único escudo viable" },
  { fecha: "03/05", rival: "Independiente Rivadavia", tipo: "Por definir", dificultad: "Alta", recomendacion: "PARTIDO CLAVE: rival de zona baja. Máxima intensidad y balón parado" }
]

// Problemas identificados
const problemasClave = [
  { 
    titulo: "Colapso Ofensivo", 
    descripcion: "0.30 goles/partido (29º). Sin goles de cabeza pese a tener la delantera más alta de la liga.",
    impacto: "Crítico",
    icono: Goal
  },
  { 
    titulo: "Esterilidad de Posesión", 
    descripcion: "49% posesión pero 0 goles en 180 minutos vs Huracán y Sarmiento (este último con 10 hombres).",
    impacto: "Crítico",
    icono: Activity
  },
  { 
    titulo: "Fracaso vs Rivales Directos", 
    descripcion: "Derrota 2-0 vs Sarmiento (descenso directo). Solo 5 puntos en 10 partidos.",
    impacto: "Crítico",
    icono: TrendingDown
  },
  { 
    titulo: "Subexplotación Biométrica", 
    descripcion: "De la Vega (1.91m), Villarreal (1.89m), Novillo (1.90m) sin goles de cabeza.",
    impacto: "Alto",
    icono: Target
  }
]

// Recomendaciones actualizadas
const recomendaciones = [
  "Contratar INMEDIATAMENTE a Israel Damonte - Candidato óptimo para la salvación",
  "Implementar fútbol directo (Route One) con envíos largos a delanteros altos",
  "Explotar a Facundo De la Vega (1.91m) como referencia primaria en centros cruzados",
  "Sociedad Arias-Villarreal: Arias como apoyo para segundas pelotas",
  "Rotar a Bochi (38 años) - Obsoleto para transiciones rápidas",
  "Maximizar jugadas a balón parado con Zalazar, Moya y delanteros altos"
]

// Colores para gráficos
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

export default function AldosiviDashboard() {
  const [dbStats, setDbStats] = useState({
    golesTotales: clubData.diferenciaGol, 
    promedioPosesion: 49,
    golesPorPartido: 0.30,
    partidosJugados: clubData.partidosJugados
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.summary.partidosJugados > 0) {
          setDbStats(res.data.summary);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-950 via-emerald-950 to-green-900 text-white">
      {/* Header Modernizado y No-Fijo */}
      <header className="relative z-50 mb-8 border-b border-green-800 bg-linear-to-r from-green-950 via-[#0a3118] to-green-950 shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] before:opacity-5">
        <div className="container relative mx-auto px-6 py-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="bg-red-600 animate-pulse">
                  ALERTA DESCENSO: ESTADO CRÍTICO
                </Badge>
                <Badge variant="outline" className="text-yellow-100 border-yellow-400">
                  <Activity className="w-3 h-3 mr-1" />
                  Actualizado: Hoy
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <img src="/escudo-aldosivi.png" alt="C.A. Aldosivi" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md" />
                {clubData.nombre}
              </h1>
              <p className="text-yellow-100/80 text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {clubData.ciudad} • Centro de Datos & Análisis de Rendimiento
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <UploadButton onUploadSuccess={() => window.location.reload()} />
              <div className="flex items-center gap-4 bg-green-950/50 p-4 rounded-xl border border-green-800/60/50 backdrop-blur-sm">
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-sm px-3 py-1">
                <Trophy className="w-4 h-4 mr-2" />
                Liga Profesional 2026 - Apertura
              </Badge>
              <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                Posición: {clubData.posicionLiga}º
              </Badge>
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Promedio: {clubData.promedioDescenso}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* KPIs Principales */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-green-200 text-xs">Valor Plantilla</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">€{clubData.valorPlantilla}M</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span className="text-green-200 text-xs">Jugadores</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{clubData.jugadores}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-green-200 text-xs">Puntos</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">{clubData.puntos}</p>
                <p className="text-xs text-emerald-400">{clubData.partidosJugados} PJ liga | DG: {clubData.diferenciaGol}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  <span className="text-green-200 text-xs">Goles (Históricos)</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">{Number(dbStats.golesTotales).toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-green-200 text-xs">Promedio</span>
                </div>
                <p className="text-2xl font-bold text-red-400 mt-2">{clubData.promedioDescenso}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/40 border-green-800/60">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  <span className="text-green-200 text-xs">DT Interino</span>
                </div>
                <p className="text-lg font-bold text-white mt-2">{clubData.dtInterino}</p>
                <p className="text-xs text-emerald-400">Tras salida de Farré</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Alerta Principal */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-700">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-300">ALERTA MÁXIMA: Zona de Descenso Directo (12 PJ)</h3>
                  <p className="text-green-100 mt-2">
                    Aldosivi ocupa el <strong className="text-red-400">puesto 29º de 30</strong> en la tabla anual con <strong className="text-yellow-400">6 puntos en 12 PJ</strong> y
                    un promedio histórico de <strong className="text-white">{clubData.promedioDescenso}</strong>.
                    Bajo Damonte (debut 31/03): derrota 0-2 vs Argentinos Jrs y empate 0-0 con Estudiantes RC
                    (Zalazar expulsado). Solo <strong className="text-red-400">0 goles en los últimos 5 partidos de liga</strong> —
                    la sequía ofensiva sigue siendo el problema existencial del equipo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs de contenido */}
        <Tabs defaultValue="metricas" className="space-y-6">
          <TabsList className="bg-green-900 border-green-800/60 grid w-full grid-cols-5">
            <TabsTrigger value="metricas" className="data-[state=active]:bg-green-800">Métricas</TabsTrigger>
            <TabsTrigger value="descenso" className="data-[state=active]:bg-green-800">Descenso</TabsTrigger>
            <TabsTrigger value="plantilla" className="data-[state=active]:bg-green-800">Plantilla</TabsTrigger>
            <TabsTrigger value="partidos" className="data-[state=active]:bg-green-800">Partidos</TabsTrigger>
            <TabsTrigger value="dt" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">Candidatos DT</TabsTrigger>
          </TabsList>

          {/* Tab: Candidatos DT */}
          <TabsContent value="dt" className="space-y-6">
            <div className="mb-4 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
              <h3 className="text-green-400 font-bold mb-1">✓ Israel Damonte ya fue contratado</h3>
              <p className="text-green-100 text-sm">Este módulo queda únicamente con fines de archivo, dado que la directiva concretó la llegada del entrenador recomendado.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {candidatosDT.map((candidato, index) => (
                <Card key={index} className={`bg-green-900/40 border-2 ${
                  candidato.status === 'recomendado' ? 'border-green-500 ring-2 ring-green-500/30' :
                  candidato.status === 'favorable' ? 'border-yellow-500' :
                  candidato.status === 'neutral' ? 'border-orange-500' : 'border-red-500'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {candidato.nombre}
                          {candidato.status === 'recomendado' && (
                            <Badge className="bg-green-600 text-white text-xs">RECOMENDADO</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-green-200">
                          {candidato.edad} años • {candidato.perfil} • Esquema: {candidato.esquema}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          candidato.compatibilidad >= 80 ? 'text-green-400' :
                          candidato.compatibilidad >= 50 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {candidato.compatibilidad}%
                        </p>
                        <p className="text-xs text-emerald-400">Compatibilidad</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-100 text-sm mb-4">{candidato.filosofia}</p>
                    
                    <div className="mb-4">
                      <Progress value={candidato.compatibilidad} className={`h-2 ${
                        candidato.compatibilidad >= 80 ? '[&>div]:bg-green-500' :
                        candidato.compatibilidad >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                      }`} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Fortalezas
                        </p>
                        <ul className="space-y-1">
                          {candidato.fortalezas.map((f, i) => (
                            <li key={i} className="text-xs text-green-200">• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Riesgos
                        </p>
                        <ul className="space-y-1">
                          {candidato.debilidades.map((d, i) => (
                            <li key={i} className="text-xs text-green-200">• {d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      candidato.status === 'recomendado' ? 'bg-green-900/30' :
                      candidato.status === 'favorable' ? 'bg-yellow-900/30' :
                      candidato.status === 'neutral' ? 'bg-orange-900/30' : 'bg-red-900/30'
                    }`}>
                      <p className="text-xs text-green-100">{candidato.detalle}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Recomendación final DT */}
            <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-600">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">RECOMENDACIÓN VINCULANTE</h3>
                    <p className="text-green-50 mt-2">
                      Contratar a <strong className="text-white">Israel Damonte</strong> como Director Técnico definitivo. 
                      Su filosofía de "guerrilla" es el <strong className="text-green-400">único enfoque compatible</strong> con 
                      las limitaciones técnicas del plantel. Sistematizará la fricción, activará el juego aéreo con 
                      De la Vega (1.91m) y Cordero (1.86m), y erradicará la posesión estéril.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Métricas */}
          <TabsContent value="metricas" className="space-y-6">
            {/* Problemas Clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problemasClave.map((problema, index) => (
                <Card key={index} className="bg-green-900/40 border-green-800/60">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <problema.icono className={`w-6 h-6 ${
                        problema.impacto === 'Crítico' ? 'text-red-400' : 'text-orange-400'
                      } flex-shrink-0 mt-1`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{problema.titulo}</h4>
                          <Badge className={`text-xs ${
                            problema.impacto === 'Crítico' ? 'bg-red-600' : 'bg-orange-600'
                          }`}>
                            {problema.impacto}
                          </Badge>
                        </div>
                        <p className="text-green-200 text-sm mt-1">{problema.descripcion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabla de Métricas */}
            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Métricas de Rendimiento (Estilo FM)
                </CardTitle>
                <CardDescription>Datos actualizados al 04 de Abril de 2026 (12 PJ liga) — Corregidos vía fichajes.com + resultados reales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-800/60">
                        <th className="text-left py-3 px-4 text-green-200 font-medium">Métrica</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Aldosivi</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Media Liga</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Ranking</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Estado</th>
                        <th className="text-left py-3 px-4 text-green-200 font-medium hidden lg:table-cell">Líder Categ.</th>
                        <th className="text-left py-3 px-4 text-green-200 font-medium hidden xl:table-cell">Nota Auditoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricsData.map((row, index) => (
                        <tr key={index} className="border-b border-green-800/60/50 hover:bg-green-800/30">
                          <td className="py-3 px-4 text-white font-medium">{row.metrica}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${
                              row.status === 'critical' ? 'text-red-400' : 
                              row.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {row.valor}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-green-200">{row.liga}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="outline" className={`${
                              row.status === 'critical'
                                ? 'border-red-500 text-red-400' 
                                : row.status === 'good'
                                  ? 'border-green-500 text-green-400'
                                  : 'border-yellow-500 text-yellow-400'
                            }`}>
                              {row.ranking}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`text-xs ${
                              row.status === 'critical' ? 'bg-red-600' :
                              row.status === 'good' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {row.evaluacion}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-emerald-400 text-xs hidden lg:table-cell">{row.lider}</td>
                          <td className="py-3 px-4 text-slate-400 text-xs hidden xl:table-cell italic">{row.nota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="bg-green-900/40 border-green-800/60">
                <CardHeader>
                  <CardTitle className="text-white">Perfil de Rendimiento</CardTitle>
                  <CardDescription>Comparativa multidimensional vs media de la liga</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#166534" />
                      <PolarAngleAxis dataKey="categoria" tick={{ fill: '#bbf7d0', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                      <Radar name="Aldosivi" dataKey="Aldosivi" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                      <Radar name="Liga" dataKey="Liga" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart Comparativo */}
              <Card className="bg-green-900/40 border-green-800/60">
                <CardHeader>
                  <CardTitle className="text-white">Comparativa con Líderes</CardTitle>
                  <CardDescription>Métricas clave vs equipos líderes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#166534" />
                      <XAxis type="number" tick={{ fill: '#bbf7d0' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#bbf7d0', fontSize: 10 }} width={100} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: '8px' }}
                        labelStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar dataKey="goles" fill="#ef4444" name="Goles/Partido" />
                      <Bar dataKey="tiros" fill="#f97316" name="Tiros" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Descenso */}
          <TabsContent value="descenso" className="space-y-6">
            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Tabla de Promedios - Zona de Descenso
                </CardTitle>
                <CardDescription>Sistema de coeficientes (últimas 3 temporadas)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-800/60">
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Pos.</th>
                        <th className="text-left py-3 px-4 text-green-200 font-medium">Equipo</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Promedio</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">PJ</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">PTS</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promediosData.map((row, index) => (
                        <tr key={index} className={`border-b border-green-800/60/50 ${
                          row.equipo === 'Aldosivi' ? 'bg-red-900/30' : 'hover:bg-green-800/30'
                        }`}>
                          <td className="py-3 px-4 text-center text-white">{row.puesto}º</td>
                          <td className="py-3 px-4 text-white font-medium">{row.equipo}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${
                              row.estado === 'critico' ? 'text-red-400' :
                              row.estado === 'peligro' ? 'text-orange-400' :
                              row.estado === 'descenso' ? 'text-red-500' : 'text-green-400'
                            }`}>
                              {row.promedio.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-green-200">{row.pj}</td>
                          <td className="py-3 px-4 text-center text-green-200">{row.pts}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`text-xs ${
                              row.estado === 'seguro' ? 'bg-green-600' :
                              row.estado === 'alerta' ? 'bg-yellow-600' :
                              row.estado === 'peligro' ? 'bg-orange-600' :
                              row.estado === 'critico' ? 'bg-red-600' : 'bg-red-800'
                            }`}>
                              {row.estado === 'seguro' ? 'Seguro' :
                               row.estado === 'alerta' ? 'Alerta' :
                               row.estado === 'peligro' ? 'Peligro' :
                               row.estado === 'critico' ? 'CRÍTICO' : 'Descenso'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Tabla Anual 2026 - Zona Baja (2do Descenso)
                </CardTitle>
                <CardDescription>Puntos acumulados en el año en curso (Inició en Enero)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-800/60">
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Pos.</th>
                        <th className="text-left py-3 px-4 text-green-200 font-medium">Equipo</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">PJ</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Dif. Gol</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">PTS</th>
                        <th className="text-center py-3 px-4 text-green-200 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablaAnualData.map((row, index) => (
                        <tr key={index} className={`border-b border-green-800/60/50 ${
                          row.equipo === 'Aldosivi' ? 'bg-red-900/30' : 'hover:bg-green-800/30'
                        }`}>
                          <td className="py-3 px-4 text-center text-white">{row.puesto}º</td>
                          <td className="py-3 px-4 text-white font-medium">{row.equipo}</td>
                          <td className="py-3 px-4 text-center text-green-200">{row.pj}</td>
                          <td className="py-3 px-4 text-center text-green-200">{row.difGol}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${
                              row.equipo === 'Aldosivi' ? 'text-red-400' :
                              row.pts <= 30 ? 'text-red-500' : 'text-white'
                            }`}>
                              {row.pts}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`text-xs ${
                              row.estado === 'seguro' ? 'bg-green-600' :
                              row.estado === 'alerta' ? 'bg-yellow-600' :
                              row.estado === 'peligro' ? 'bg-orange-600' :
                              row.estado === 'critico' ? 'bg-red-600' : 'bg-red-800'
                            }`}>
                              {row.estado === 'seguro' ? 'Seguro' :
                               row.estado === 'alerta' ? 'Alerta' :
                               row.estado === 'peligro' ? 'Peligro' :
                               row.estado === 'critico' ? 'CRÍTICO' : 'Descenso'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-orange-900/20 border border-orange-800/50 rounded-lg">
                  <h4 className="text-orange-400 font-bold text-sm mb-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> REGLAMENTO AFA (30 Equipos):
                  </h4>
                  <p className="text-green-100 text-xs">
                    Hay emparejamientos dinámicos: si un equipo ocupa el último lugar en ambas tablas (Promedios y Anual), 
                    el descenso de la Tabla Anual se transfiere al <strong>penúltimo clasificado (Posición 29º)</strong> de la misma.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-900/40 border-green-800/60">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Objetivo de Permanencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 text-sm">
                    Superar a <strong className="text-white">Gimnasia Mendoza</strong> (promedio 1.000) o a <strong className="text-white">Sarmiento</strong> (promedio 1.012) es el objetivo primario.
                    La diferencia con el puesto 28 es de <strong className="text-yellow-400">0.114 puntos porcentuales</strong>. 
                    Esperar que <strong className="text-white">Gimnasia Mendoza</strong> (si es que la tabla varía) no encadene victorias, 
                    ya que los promedios de los recién ascendidos son muy volátiles por pocos partidos.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-900/30 border-red-700">
                <CardHeader>
                  <CardTitle className="text-red-300 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Daño vs Sarmiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 text-sm">
                    La derrota 2-0 en Junín fue un <strong className="text-red-400">golpe directo al descenso</strong>. 
                    Perder ante rival directo con superioridad numérica (60 min) fue un 
                    <strong className="text-red-400">daño colateral incalculable</strong> en la matemática.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Plantilla */}
          <TabsContent value="plantilla" className="space-y-6">
            {/* Distribución */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-green-900/40 border-green-800/60">
                <CardContent className="pt-4">
                  <h4 className="text-green-200 text-sm mb-2">Distribución por Posición</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Porteros</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Defensas</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Mediocampistas</span>
                      <Badge variant="outline">10</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Delanteros</span>
                      <Badge variant="outline">10</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-900/40 border-green-800/60">
                <CardContent className="pt-4">
                  <h4 className="text-green-200 text-sm mb-2">Altura Promedio Delantera</h4>
                  <p className="text-3xl font-bold text-green-400">1.86m</p>
                  <p className="text-xs text-emerald-400">Una de las más altas de la liga</p>
                </CardContent>
              </Card>
              <Card className="bg-green-900/40 border-green-800/60">
                <CardContent className="pt-4">
                  <h4 className="text-green-200 text-sm mb-2">Nacionalidad</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{clubData.jugadores - clubData.extranjeros}</p>
                      <p className="text-emerald-400 text-xs">Argentinos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{clubData.extranjeros}</p>
                      <p className="text-emerald-400 text-xs">Extranjeros</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-900/30 border-yellow-700">
                <CardContent className="pt-4">
                  <h4 className="text-yellow-400 text-sm mb-2">DT Interino</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold">
                      FO
                    </div>
                    <div>
                      <p className="text-white font-semibold">{clubData.dtInterino}</p>
                      <p className="text-yellow-500 text-xs">Tras salida de Farré</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jugadores */}
            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Plantilla Profesional - Datos Biométricos
                </CardTitle>
                <CardDescription>Jugadores clave con datos físicos verificados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jugadoresDestacados.map((jugador, index) => (
                    <Card key={index} className={`bg-green-800/50 border-slate-600 ${jugador.key ? 'ring-2 ring-yellow-500/50' : ''}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{jugador.nombre}</h4>
                            <p className="text-green-200 text-sm">{jugador.posicion}</p>
                            <p className="text-yellow-400 text-xs">{jugador.perfil}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-yellow-600 text-white">{jugador.rating}</Badge>
                            {jugador.key && <p className="text-xs text-yellow-400 mt-1">Key Player</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-emerald-400">
                          <span>{jugador.edad} años</span>
                          {jugador.altura && <span>{jugador.altura}</span>}
                          {jugador.peso && <span>{jugador.peso}</span>}
                          <span>{jugador.partidos} PJ</span>
                        </div>
                        {(jugador.goles > 0 || jugador.asistencias) && (
                          <div className="flex gap-3 mt-2">
                            {jugador.goles > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Goal className="w-3 h-3 text-green-400" />
                                <span className="text-green-400">{jugador.goles} G</span>
                              </div>
                            )}
                            {jugador.asistencias && (
                              <div className="flex items-center gap-1 text-xs">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-400">{jugador.asistencias} A</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Partidos */}
          <TabsContent value="partidos" className="space-y-6">
            {/* Resultados */}
            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Partidos Disputados (Actualizado)
                </CardTitle>
                <CardDescription>Temporada Apertura 2026 — Última actualización: 04/04/2026 (12 PJ liga / 13 incl. Copa Argentina)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-800/60">
                        <th className="text-left py-3 px-2 text-green-200 text-sm">Fecha</th>
                        <th className="text-left py-3 px-2 text-green-200 text-sm">Rival</th>
                        <th className="text-center py-3 px-2 text-green-200 text-sm">Tipo</th>
                        <th className="text-center py-3 px-2 text-green-200 text-sm">Resultado</th>
                        <th className="text-center py-3 px-2 text-green-200 text-sm">Competencia</th>
                        <th className="text-left py-3 px-2 text-green-200 text-sm hidden md:table-cell">Análisis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partidosData.map((partido, index) => {
                        const [golesFavor, golesContra] = partido.resultado.split('-').map(Number)
                        const resultado = golesFavor > golesContra ? 'victoria' : golesFavor < golesContra ? 'derrota' : 'empate'
                        return (
                          <tr key={index} className={`border-b border-green-800/60/50 hover:bg-green-800/30 ${
                            partido.rival === 'Sarmiento (J)' ? 'bg-red-900/20' : ''
                          }`}>
                            <td className="py-3 px-2 text-green-100 text-sm">{partido.fecha}</td>
                            <td className="py-3 px-2 text-white font-medium">
                              {partido.rival}
                              {partido.rival === 'Sarmiento (J)' && (
                                <span className="text-red-400 text-xs ml-2">RIVAL DIRECTO</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge variant="outline" className={partido.tipo === 'Local' ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'}>
                                {partido.tipo}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`font-bold px-3 py-1 rounded ${
                                resultado === 'victoria' ? 'bg-green-900/50 text-green-400' :
                                resultado === 'derrota' ? 'bg-red-900/50 text-red-400' :
                                'bg-green-800 text-green-100'
                              }`}>
                                {partido.resultado}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center text-green-200 text-sm">{partido.competencia}</td>
                            <td className="py-3 px-2 text-emerald-400 text-xs hidden md:table-cell italic">{partido.nota}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Partidos */}
            <Card className="bg-green-900/40 border-green-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Fixture Próximo - Partidos Clave
                </CardTitle>
                <CardDescription>Definición de la permanencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fixtureData.map((partido, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                      partido.rival === 'Est. Río Cuarto' 
                        ? 'bg-red-900/20 border-red-600' 
                        : 'bg-green-800/30 border-slate-600'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-white font-bold">{partido.fecha}</p>
                        </div>
                        <div>
                          <p className="text-white font-medium">vs {partido.rival}</p>
                          <p className="text-green-200 text-sm">{partido.tipo}</p>
                          {partido.rival === 'Est. Río Cuarto' && (
                            <Badge className="bg-red-600 text-white text-xs mt-1">PARTIDO FINAL</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={`${
                          partido.dificultad === 'Muy Alta' ? 'bg-red-600' :
                          partido.dificultad === 'Alta' ? 'bg-orange-600' : 'bg-yellow-600'
                        }`}>
                          {partido.dificultad}
                        </Badge>
                        <div className="max-w-[200px]">
                          <p className="text-green-100 text-xs">{partido.recomendacion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recomendaciones */}
        <section className="mt-8">
          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Plan de Acción Estratégico
              </CardTitle>
              <CardDescription>Directrices vinculantes para asegurar la permanencia</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recomendaciones.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Badge className="bg-yellow-600 mt-0.5">{index + 1}</Badge>
                    <span className="text-green-50">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-800/60 bg-green-950/90 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 text-sm text-emerald-400">

            {/* Info principal */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p>Centro de Inteligencia Deportiva &copy; Club Atlético Aldosivi - Ciclo 2026</p>
              <p className="text-xs text-green-500/70">Actualizado: 04 de Abril de 2026 | Fuente: Liga Profesional AFA + fichajes.com + resultados reales (Fecha 13)</p>
            </div>

            {/* Sitios Amigos */}
            <div className="border-t border-green-800/40 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest">Sitios Amigos</span>
                <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Saque de Meta */}
                <a
                  href="https://saquedemetamdp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/40 hover:border-blue-500/70 hover:from-blue-800/60 hover:to-blue-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center group-hover:bg-blue-500/40 transition-colors duration-300">
                    <Newspaper className="w-4 h-4 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs leading-tight">Saque de Meta MDP</p>
                    <p className="text-blue-300/70 text-xs truncate">Portal deportivo marplatense</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-blue-400/50 group-hover:text-blue-300 transition-colors duration-300 flex-shrink-0" />
                </a>

                {/* Isadora Store */}
                <a
                  href="https://isadora.ninnotech.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/40 hover:border-purple-500/70 hover:from-purple-800/60 hover:to-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors duration-300">
                    <ShoppingBag className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs leading-tight">Isadora Store</p>
                    <p className="text-purple-300/70 text-xs truncate">Tienda online Ninnotech</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-purple-400/50 group-hover:text-purple-300 transition-colors duration-300 flex-shrink-0" />
                </a>

                {/* Portfolio */}
                <a
                  href="https://portfolio-matias-asaro-dev.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/40 hover:border-yellow-500/70 hover:from-yellow-800/60 hover:to-yellow-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/30 hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-yellow-600/30 border border-yellow-500/40 flex items-center justify-center group-hover:bg-yellow-500/40 transition-colors duration-300">
                    <Briefcase className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs leading-tight">Portfolio Dev</p>
                    <p className="text-yellow-300/70 text-xs truncate">Maty_Asaro_Dev · Ninnotech</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-yellow-400/50 group-hover:text-yellow-300 transition-colors duration-300 flex-shrink-0" />
                </a>

              </div>
            </div>

            {/* Créditos */}
            <div className="border-t border-green-800/40 pt-4 flex items-center justify-center">
              <p className="text-green-500/60 text-xs">
                Desarrollado con 💚 por{" "}
                <span className="text-yellow-400/90 font-semibold">Maty_Asaro_Dev</span>
                <span className="text-green-500/60"> · </span>
                <span className="text-yellow-400/90 font-semibold">Ninnotech</span>
              </p>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}
