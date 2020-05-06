export interface Bullet {
  id: string;
  text: string;
  createdTime?: string;
  startTime: string;
  color?: string;
  type: BulletType;
}

export enum BulletType {
  RIGHT = 0,
  TOP = 1,
  BOTTOM = 2,
}

export interface BulletPhysic {
  width: number;
  height?: number;
  top?: number;
  bottom?: number;
}

export type TrackBullet = Bullet & {
  physic: BulletPhysic;
  trackId: Track["id"];
};

export type Track = TopTrack | RightTrack | BottomTrack;

type BaseTrack = {
  id: string;
  width: number;
  height: number;
  bullets: TrackBullet[];
};

export type RightTrack = BaseTrack & {
  top: number;
  type: BulletType.RIGHT;
};

export type TopTrack = BaseTrack & {
  top: number;
  type: BulletType.TOP;
};

export type BottomTrack = BaseTrack & {
  bottom: number;
  type: BulletType.BOTTOM;
};

export enum VideoStatus {
  PLAYING,
  PAUSE,
}
