export interface Bullet {
  id: string;
  text: string;
  createdTime: string;
  startTime: string;
  color?: string;
}

export interface BulletPhysic {
  width: number;
  height?: number;
  top: number;
}

export type TrackBullet = Bullet & {
  physic: BulletPhysic;
};

export interface Track {
  top: number;
  width: number;
  height: number;
  bullets: TrackBullet[];
}

export enum VideoStatus {
  PLAYING,
  PAUSE,
}
