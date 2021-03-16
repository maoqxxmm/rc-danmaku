import React, {
  memo,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import cx from "classnames";
import {
  Bullet,
  VideoStatus,
  Track,
  BulletType,
  RightTrack,
  TopTrack,
  BottomTrack,
  TrackBullet,
} from "../../type";
import "./index.css";
import { DanmakuTrack } from "./track";
import { measureDmWidth, findTargetTrack } from "./utils";
import { useAnimationFrame } from "./hooks/use-animation-frame";

interface Props {
  containerEl: HTMLElement | null;
  videoEl: HTMLVideoElement | null;
  videoStatus: VideoStatus;
  danmakuList: Bullet[];
}

export interface Tracks {
  [BulletType.RIGHT]: RightTrack[];
  [BulletType.TOP]: TopTrack[];
  [BulletType.BOTTOM]: BottomTrack[];
}

export const TRACK_OFFSET = 30;
export const TRACK_SAFE_BORDER = 30;
export const DM_SAFE_DISTANCE = 30;
export const DM_ANIMATE_DURATION = 5;

export const Danmaku: React.FC<Props> = memo((props) => {
  // 弹幕列表
  const [danmakuList, setDanmakuList] = useState<Bullet[]>([]);
  // 轨道
  const [tracks, setTracks] = useState<Tracks>({
    [BulletType.RIGHT]: [],
    [BulletType.TOP]: [],
    [BulletType.BOTTOM]: [],
  });
  // 筛选弹幕的起始下标
  const danmakuCurosrRef = useRef<number>(0);

  useEffect(() => {
    const sortedList = [...props.danmakuList].sort((a, b) => {
      return parseFloat(a.startTime) - parseFloat(b.startTime);
    });
    setDanmakuList(sortedList);
  }, [props.danmakuList]);

  useLayoutEffect(() => {
    if (!props.containerEl) {
      return;
    }
    const containerBounding = props.containerEl.getBoundingClientRect();
    const containerWidth = containerBounding.width;
    const containerHeight = containerBounding.height;
    const verticalTrackCounts = Math.ceil(
      (containerHeight - TRACK_SAFE_BORDER * 2) / TRACK_OFFSET
    );

    const newTracks: Tracks = {
      [BulletType.RIGHT]: Array(verticalTrackCounts)
        .fill(1)
        .map((_a, index) => ({
          id: `${BulletType.RIGHT}-${index}`,
          top: index * TRACK_OFFSET,
          width: containerWidth,
          height: TRACK_OFFSET,
          bullets: [],
          type: BulletType.RIGHT,
        })),
      [BulletType.TOP]: Array(Math.floor(verticalTrackCounts / 2))
        .fill(1)
        .map((_a, index) => ({
          id: `${BulletType.TOP}-${index}`,
          top: index * TRACK_OFFSET,
          width: containerWidth,
          height: TRACK_OFFSET,
          bullets: [],
          type: BulletType.TOP,
        })),
      [BulletType.BOTTOM]: Array(Math.ceil(verticalTrackCounts / 2))
        .fill(1)
        .map((_a, index) => ({
          id: `${BulletType.BOTTOM}-${index}`,
          bottom: index * TRACK_OFFSET,
          width: containerWidth,
          height: TRACK_OFFSET,
          bullets: [],
          type: BulletType.BOTTOM,
        })),
    };
    setTracks(newTracks);
  }, [props.containerEl]);

  const frame = useMemo(() => {
    return () => {
      if (props.videoStatus === VideoStatus.PAUSE) {
        return;
      }
      if (!danmakuList.length || !tracks[BulletType.RIGHT].length) {
        return;
      }
      if (!props.containerEl) {
        return;
      }
      const currentTime = props.videoEl?.currentTime || 0;
      if (!currentTime) {
        return;
      }
      const newTracks = { ...tracks };
      while (danmakuCurosrRef.current < danmakuList.length) {
        const dm = danmakuList[danmakuCurosrRef.current];
        if (parseFloat(dm.startTime) > currentTime) {
          break;
        }
        const targetTrack = findTargetTrack(dm, tracks, props.containerEl);
        if (targetTrack === null) {
          danmakuCurosrRef.current++;
          continue;
        }
        const dmWidth = measureDmWidth(dm.text) || 0;
        targetTrack.bullets.push({
          ...dm,
          trackId: targetTrack.id,
          physic: {
            width: dmWidth,
            top: (targetTrack as RightTrack).top,
            bottom: (targetTrack as BottomTrack).bottom,
          },
        });
        danmakuCurosrRef.current++;
      }
      setTracks(newTracks);
    };
  }, [
    props.videoStatus,
    props.videoEl,
    props.containerEl,
    danmakuList,
    tracks,
  ]);

  useAnimationFrame(frame);

  const onAnimationEnd = useCallback(
    (bullet: TrackBullet) => {
      const targetTracks = tracks[bullet.type || BulletType.RIGHT] as Track[];
      const targetTrack = targetTracks.find(
        (track) => track.id === bullet.trackId
      );
      if (targetTrack) {
        targetTrack.bullets = targetTrack.bullets.filter(
          (dm) => dm.id !== bullet.id
        );
      }
    },
    [tracks]
  );

  const renderTracks = (tracks: Track[]) => {
    return tracks.map((track) => (
      <DanmakuTrack key={track.id} {...track} onAnimationEnd={onAnimationEnd} />
    ));
  };

  return (
    <div
      className={cx("danmaku-wrapper", {
        playing: props.videoStatus === VideoStatus.PLAYING,
      })}
    >
      {renderTracks(tracks[BulletType.RIGHT])}
      {renderTracks(tracks[BulletType.TOP])}
      {renderTracks(tracks[BulletType.BOTTOM])}
    </div>
  );
});
