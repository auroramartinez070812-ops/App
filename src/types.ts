export interface MarketOpportunity {
  country: string;
  industry: string;
  demandLevel: 'Alta' | 'Media' | 'Baja';
  averagePriceRange: string;
  priceLevel: 'Alto' | 'Medio' | 'Bajo';
  competitionLevel: 'Alta' | 'Media' | 'Baja';
  opportunities: string[];
  risks: string[];
  keyHighlights: string[];
  summary: string;
}

export interface MarketTrend {
  year: string;
  demand: number;
  price: number;
}

export interface Supplier {
  name: string;
  location: string;
  specialization: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface ReliabilityMetric {
  label: string;
  value: string | number;
  status: 'positive' | 'neutral' | 'negative';
}

export interface ExporterCountry {
  country: string;
  exportVolume: string;
  pros: string[];
  cons: string[];
  suitabilityScore: number; // 0-100
}

export interface RecommendedOrigin {
  country: string;
  reasoning: string;
  keyAdvantages: string[];
}

export interface DetailedMarketReport {
  opportunity: MarketOpportunity;
  trends: MarketTrend[];
  keyCompetitors: string[];
  keySuppliers: Supplier[];
  topExporters: ExporterCountry[];
  recommendedOrigin: RecommendedOrigin;
  entryBarriers: string[];
  regulatoryEnvironment: string;
  reliabilityAnalysis: {
    score: number; // 0-100
    reasoning: string;
    metrics: ReliabilityMetric[];
  };
}
