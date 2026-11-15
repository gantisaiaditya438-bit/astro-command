// ASTRO COMMAND - NASA Database & Open API TypeScript Definitions

export interface NasaDatasetRecord {
  id?: string;
  source_name: string;
  dataset_name: string;
  category: string;
  description: string;
  original_source_url: string;
  dataset_identifier: string;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface NasaSpaceWeatherRecord {
  id?: string;
  event_identifier: string;
  event_type: 'FLR' | 'CME' | 'GST' | 'SEP' | 'IPS';
  start_time: string;
  end_time?: string | null;
  classification?: string;
  description: string;
  source_url: string;
  raw_data: Record<string, any>;
  fetched_at?: string;
  educationalTakeaway?: string;
}

export interface NasaPlanetaryImageRecord {
  id?: string;
  planet: 'Mars' | 'Moon' | 'Deep Space';
  rover_name?: string;
  camera_name?: string;
  image_url: string;
  earth_date: string;
  sol?: number;
  source_url: string;
  metadata: Record<string, any>;
  fetched_at?: string;
}

export interface NasaResearchRecord {
  id?: string;
  title: string;
  research_category: string;
  summary: string;
  dataset_url: string;
  source_url: string;
  metadata: Record<string, any>;
  fetched_at?: string;
}

export interface NasaSyncLogRecord {
  id?: string;
  source_name: 'DONKI' | 'MarsRover' | 'OSDR' | 'APOD' | 'PDS' | 'ALL';
  sync_status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  records_processed: number;
  error_message?: string | null;
  started_at: string;
  completed_at?: string;
}

export interface NasaDataCenterState {
  spaceWeather: NasaSpaceWeatherRecord[];
  roverImages: NasaPlanetaryImageRecord[];
  researchStudies: NasaResearchRecord[];
  datasets: NasaDatasetRecord[];
  apod?: {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    date: string;
    media_type: string;
    copyright?: string;
  } | null;
  lastSyncLogs: NasaSyncLogRecord[];
  dataSourceType: 'LIVE_API' | 'SUPABASE_DB' | 'CACHED_LOCAL';
  lastUpdated: string;
  isSyncing: boolean;
  syncError?: string | null;
}
