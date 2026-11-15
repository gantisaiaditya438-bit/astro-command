export type CameraMode = 'overview' | 'exploration' | 'emergency';

export type InteractiveBuildingId =
  | 'habitat'
  | 'solar_station'
  | 'oxygen_facility'
  | 'greenhouse'
  | 'research_lab'
  | 'radiation_shelter'
  | 'rover';

export interface BuildingDetails {
  id: InteractiveBuildingId;
  name: string;
  category: string;
  position: [number, number, number];
  description: string;
  operationalStatus: 'nominal' | 'warning' | 'critical' | 'boosted';
}

