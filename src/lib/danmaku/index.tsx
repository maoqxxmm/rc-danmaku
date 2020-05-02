import React, { memo, useMemo, useEffect, useState } from "react";
import { Bullet, VideoStatus, Track, TrackBullet } from "../../type";
import cx from "classnames";
import "./index.css";
import { DanmakuTrack } from "./track";
import { measureDmWidth } from "./utils";

interface Props {
  containerEl: HTMLElement | null;
  videoStatus: VideoStatus;
  danmakuList: Bullet[];
  onClick: () => void;
}

const TRACK_OFFSET = 50;
const TRACK_SAFE_BORDER = 100;

export const Danmaku: React.FC<Props> = memo((props) => {
  const [danmakuList, setDanmakuList] = useState<Bullet[]>(props.danmakuList);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!props.containerEl) {
      setTracks([]);
      return;
    }
    const containerBounding = props.containerEl.getBoundingClientRect();
    const containerWidth = containerBounding.width;
    const containerHeight = containerBounding.height;
    const trackCounts = Math.ceil(
      (containerHeight - TRACK_SAFE_BORDER * 2) / TRACK_OFFSET
    );
    setTracks(
      Array(trackCounts)
        .fill(1)
        .map((_a, index) => ({
          top: index * TRACK_OFFSET,
          width: containerWidth,
          height: TRACK_OFFSET,
          bullets: [],
        }))
    );
  }, [props.containerEl]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!danmakuList.length || !tracks.length) {
        return;
      }
      const waitingDm = danmakuList[0];
      const waitingDmWidth = measureDmWidth(waitingDm.text);
      if (!waitingDmWidth) {
        return;
      }
      let targetTrackTop: number | undefined;
      let targetTrackBullets: TrackBullet[] = [];
      for (let track of tracks) {
        if (!track.bullets.length) {
          targetTrackTop = track.top;
          targetTrackBullets = [
            {
              ...waitingDm,
              physic: {
                width: waitingDmWidth,
                top: track.top,
              },
            },
          ];
          break;
        }
      }
      if (targetTrackTop !== undefined) {
        setTracks(
          tracks.map((track) => {
            if (track.top === targetTrackTop) {
              return {
                ...track,
                bullets: targetTrackBullets,
              };
            } else {
              return track;
            }
          })
        );
        setDanmakuList(danmakuList.slice(1));
      }
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, [danmakuList, tracks]);

  return (
    <div className="danmaku-wrapper" onClick={props.onClick}>
      {tracks.map((track) => (
        <DanmakuTrack key={track.top} {...track} />
      ))}
    </div>
  );
});
