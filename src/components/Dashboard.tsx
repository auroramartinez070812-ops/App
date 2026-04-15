import React, { useState } from 'react';
import { Search, Globe, TrendingUp, ShieldAlert, Briefcase, Info, Loader2, BarChart3, Truck, CheckCircle, Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { researchMarket } from '../services/geminiService';
import { DetailedMarketReport } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LabelList
} from 'recharts';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<DetailedMarketReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DetailedMarketReport | null>(null);
  const [filterCompetition, setFilterCompetition] = useState<'Todas' | 'Alta' | 'Media' | 'Baja'>('Todas');
  const [filterPrice, setFilterPrice] = useState<'Todos' | 'Alto' | 'Medio' | 'Bajo'>('Todos');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country || !industry) return;

    setLoading(true);
    setError(null);
    try {
      const data = await researchMarket(country, industry);
      setReports(prev => [data, ...prev]);
      setSelectedReport(data);
    } catch (err) {
      setError('No se pudo completar la investigación. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    (filterCompetition === 'Todas' || r.opportunity.competitionLevel === filterCompetition) &&
    (filterPrice === 'Todos' || r.opportunity.priceLevel === filterPrice)
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Global Market Insight</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">Investigación de Mercados IA</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">País / Región</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ej: México, Alemania, Sudeste Asiático..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Industria / Producto</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ej: Software SaaS, Energías Renovables..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Investigando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Generar Reporte
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results List & Filter */}
        {reports.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Resultados de Investigación</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-500">Competencia:</label>
                  <select 
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterCompetition}
                    onChange={(e) => setFilterCompetition(e.target.value as any)}
                  >
                    <option value="Todas">Todas</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-500">Nivel de Precio:</label>
                  <select 
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(e.target.value as any)}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Alto">Alto</option>
                    <option value="Medio">Medio</option>
                    <option value="Bajo">Bajo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((r, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedReport(r)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedReport === r 
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 truncate pr-2">{r.opportunity.industry}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      r.opportunity.competitionLevel === 'Alta' ? 'bg-red-100 text-red-700' :
                      r.opportunity.competitionLevel === 'Media' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      Comp: {r.opportunity.competitionLevel}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      r.opportunity.priceLevel === 'Alto' ? 'bg-purple-100 text-purple-700' :
                      r.opportunity.priceLevel === 'Medio' ? 'bg-blue-100 text-blue-700' :
                      'bg-teal-100 text-teal-700'
                    }`}>
                      Precio: {r.opportunity.priceLevel}
                    </span>
                  </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Globe className="w-3 h-3" />
                    {r.opportunity.country}
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No hay reportes con nivel de competencia "{filterCompetition}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Report Section */}
        {selectedReport && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-slate-200 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Reporte Detallado: {selectedReport.opportunity.industry} en {selectedReport.opportunity.country}
              </h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Cerrar Detalle
              </button>
            </div>

            {/* Executive Summary & Highlights */}
            <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Globe className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-4">Resumen Ejecutivo</h3>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-4xl">
                  {selectedReport.opportunity.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedReport.opportunity.keyHighlights.map((highlight, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="text-indigo-300 text-xs font-bold mb-2">PUNTO CLAVE 0{i+1}</div>
                      <p className="text-sm text-indigo-50 leading-snug">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                title="Demanda" 
                value={selectedReport.opportunity.demandLevel} 
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                color="emerald"
              />
              <Card 
                title="Competencia" 
                value={selectedReport.opportunity.competitionLevel} 
                icon={<BarChart3 className="w-5 h-5 text-orange-600" />}
                color="orange"
              />
              <Card 
                title="Rango de Precios" 
                value={selectedReport.opportunity.averagePriceRange} 
                icon={<Info className="w-5 h-5 text-indigo-600" />}
                color="indigo"
              />
              <Card 
                title="Mercado" 
                value={selectedReport.opportunity.country} 
                icon={<Globe className="w-5 h-5 text-slate-600" />}
                color="slate"
              />
              <Card 
                title="Confiabilidad" 
                value={`${selectedReport.reliabilityAnalysis.score}%`} 
                icon={<CheckCircle className={`w-5 h-5 ${selectedReport.reliabilityAnalysis.score > 70 ? 'text-emerald-600' : 'text-orange-600'}`} />}
                color={selectedReport.reliabilityAnalysis.score > 70 ? 'emerald' : 'orange'}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Tendencias de Demanda y Precio
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedReport.trends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      />
                      <Legend verticalAlign="top" height={48} iconType="circle" />
                      <Line 
                        type="monotone" 
                        dataKey="demand" 
                        name="Demanda" 
                        stroke="#4f46e5" 
                        strokeWidth={3} 
                        dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 7, strokeWidth: 0 }}
                      >
                        <LabelList dataKey="demand" position="top" offset={10} style={{ fontSize: '10px', fill: '#4f46e5', fontWeight: 'bold' }} />
                      </Line>
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        name="Precio" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 7, strokeWidth: 0 }}
                      >
                        <LabelList dataKey="price" position="bottom" offset={10} style={{ fontSize: '10px', fill: '#10b981', fontWeight: 'bold' }} />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Análisis de Oportunidades y Riesgos
                </h3>
                <div className="prose prose-slate max-w-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Oportunidades</h4>
                      <ul className="space-y-1">
                        {selectedReport.opportunity.opportunities.map((opt, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span> {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-orange-700 uppercase tracking-wider mb-2">Riesgos</h4>
                      <ul className="space-y-1">
                        {selectedReport.opportunity.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span> {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exporters and Recommended Origin Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Principales Países Exportadores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.topExporters.map((exporter, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📍'}</span>
                          {exporter.country}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full uppercase">
                          Score: {exporter.suitabilityScore}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Volumen: {exporter.exportVolume}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {exporter.pros.slice(0, 2).map((pro, j) => (
                            <span key={j} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                              + {pro}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {exporter.cons.slice(0, 2).map((con, j) => (
                            <span key={j} className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100">
                              - {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <CheckCircle className="w-32 h-32 text-indigo-900" />
                </div>
                <h3 className="text-md font-bold mb-4 text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Origen Recomendado
                </h3>
                <div className="mb-4">
                  <div className="text-2xl font-black text-indigo-900 mb-2 flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    {selectedReport.recommendedOrigin.country}
                  </div>
                  <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                    {selectedReport.recommendedOrigin.reasoning}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Ventajas Competitivas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.recommendedOrigin.keyAdvantages.map((adv, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-indigo-700 rounded-lg text-[10px] font-bold shadow-sm border border-indigo-100">
                          {adv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-4 text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Competidores Clave
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.keyCompetitors.map((comp, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-4 text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  Proveedores Principales
                </h3>
                <div className="space-y-3">
                  {selectedReport.keySuppliers.map((sup, i) => (
                    <div key={i} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="font-bold text-indigo-900 text-sm mb-2">{sup.name}</div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <div className="text-[11px] text-indigo-600 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {sup.location}
                          </div>
                          <div className="text-[11px] text-indigo-600 flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {sup.specialization}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-indigo-100/30">
                          {sup.website && (
                            <a href={sup.website.startsWith('http') ? sup.website : `https://${sup.website}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium">
                              <ExternalLink className="w-3 h-3" />
                              Sitio Web
                            </a>
                          )}
                          {sup.email && (
                            <a href={`mailto:${sup.email}`} className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium">
                              <Mail className="w-3 h-3" />
                              Email
                            </a>
                          )}
                          {sup.phone && (
                            <a href={`tel:${sup.phone}`} className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium">
                              <Phone className="w-3 h-3" />
                              Teléfono
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-4 text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Análisis de Confiabilidad
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 leading-relaxed italic mb-4">
                    "{selectedReport.reliabilityAnalysis.reasoning}"
                  </p>
                  <div className="space-y-2">
                    {selectedReport.reliabilityAnalysis.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs font-medium text-slate-500">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{metric.value}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            metric.status === 'positive' ? 'bg-emerald-500' :
                            metric.status === 'negative' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-4 text-slate-800 uppercase tracking-wider">Barreras de Entrada</h3>
                <ul className="space-y-2">
                  {selectedReport.entryBarriers.map((bar, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {bar}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-4 text-slate-800 uppercase tracking-wider">Entorno Regulatorio</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedReport.regulatoryEnvironment}
                </p>
              </div>
            </div>
          </div>
        )}

        {reports.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-6">
              <Globe className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Comienza tu investigación</h2>
            <p className="text-slate-500 max-w-md">
              Ingresa un país y una industria para obtener un análisis detallado impulsado por inteligencia artificial sobre el mercado global.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Card({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100',
    orange: 'bg-orange-50 border-orange-100',
    indigo: 'bg-indigo-50 border-indigo-100',
    slate: 'bg-slate-50 border-slate-100',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${colorClasses[color] || 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-900 truncate">{value}</div>
    </div>
  );
}
