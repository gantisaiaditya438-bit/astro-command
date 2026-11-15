// ASTRO COMMAND - NASA Image and Video Library TypeScript Definitions

export interface NasaImageRecord {
  id?: string;
  nasa_id: string;
  planet: string; // 'Moon' | 'Mars' | 'Mercury' | 'Venus' | 'Earth' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Sun'
  title: string;
  description: string;
  image_url: string; // High-quality display URL
  thumb_url: string; // Fast thumbnail URL
  source_url: string; // Official NASA source page
  credit: string; // Attribution: e.g. 'NASA/JPL-Caltech/Univ. of Arizona'
  date_created: string;
  media_type: string;
  center?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
  isRadarDerived?: boolean; // For Magellan Venus radar imagery
}

export interface NasaImageSearchResponse {
  items: NasaImageRecord[];
  totalHits: number;
  source: 'LIVE_API' | 'CACHED' | 'CURATED_ARCHIVE';
  query: string;
  planet?: string;
}
