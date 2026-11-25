export type Platform = "youtube" | "spotify";

export type TrackInfo = {
  platform: Platform;
  artist?: string;
  album?: string;
  track?: string;
  url?: string;
  videoId?: string;
  trackId?: string;
  success: boolean;
  error?: string;
};

export type PlaylistInfo = {
  platform: Platform;
  title?: string;
  url?: string;
  playlistId?: string;
  success: boolean;
  error?: string;
};

export type ConversionResult =
  | {
      type: "track";
      id: string;
      input: TrackInfo;
      output: TrackInfo;
    }
  | {
      type: "playlist";
      id: string;
      input: PlaylistInfo;
      output?: PlaylistInfo;
      tracks?: {
        input: TrackInfo;
        output?: TrackInfo;
      }[];
    };