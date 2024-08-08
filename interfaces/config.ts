export interface ConfigurationTemplate {
  tracks: TrackInterface[];
  timeout: number;
  debug: boolean;
}

export interface TrackInterface {
  name: string;
  artist: string;
}
