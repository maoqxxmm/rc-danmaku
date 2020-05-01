export interface Bullet {
  id: string;
  text: string;
  createdTime: string;
  startTime: string;
  color?: string;
}

export interface BulletPhysic {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface Track {
  top: number;
  height: number;
  bullets: Bullet[];
}

export enum VideoStatus {
  PLAYING,
  PAUSE,
}
