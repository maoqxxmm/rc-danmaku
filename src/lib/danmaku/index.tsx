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
import { Bullet, VideoStatus, Track } from "../../type";
import "./index.css";
import { DanmakuTrack } from "./track";
import { measureDmWidth } from "./utils";
import { useAnimationFrame } from "./hooks/use-animation-frame";

interface Props {
  containerEl: HTMLElement | null;
  videoEl: HTMLVideoElement | null;
  videoStatus: VideoStatus;
  danmakuList: Bullet[];
  onClick: () => void;
}

const TRACK_OFFSET = 50;
const TRACK_SAFE_BORDER = 100;
const DM_SAFE_DISTANCE = 30;
export const DM_ANIMATE_DURATION = 5;

export const Danmaku: React.FC<Props> = memo((props) => {
  // 弹幕列表
  const [danmakuList, setDanmakuList] = useState<Bullet[]>([]);
  // 轨道
  const [tracks, setTracks] = useState<Track[]>([]);
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

  const findTargetTrack = useCallback(
    (dm: Bullet): number | null => {
      if (!props.containerEl) {
        return null;
      }
      for (let track of tracks) {
        const lastDm = track.bullets[track.bullets.length - 1];
        if (!lastDm) {
          return track.top;
        }
        const $lastDm = document.querySelector(
          `[data-bullet-id="${lastDm.id}"]`
        );
        // 不存在就说明已经被其他候选弹幕占用了
        if (!$lastDm) {
          continue;
        }
        const $lastDmRect = $lastDm.getBoundingClientRect();
        const $containerRect = props.containerEl.getBoundingClientRect();
        const diffDistance =
          $containerRect.width +
          $containerRect.left -
          ($lastDmRect.width + $lastDmRect.left);
        // 如果最后一个弹幕距离容器右侧少于安全距离的话，这个轨道就不能再塞入新的弹幕
        if (diffDistance < DM_SAFE_DISTANCE) {
          continue;
        }
        // 上一条距离运动结束剩下的路径
        const lastDmRemainLength =
          $lastDmRect.left + $lastDmRect.width - $containerRect.left;
        // 如果上一条已经不在容器内了
        if (lastDmRemainLength <= 0) {
          return track.top;
        }
        const waitingDmWidth = measureDmWidth(dm.text) || 0;
        const vLast =
          ($containerRect.width + $lastDmRect.width) / DM_ANIMATE_DURATION;
        const vWaiting =
          ($containerRect.width + waitingDmWidth) / DM_ANIMATE_DURATION;
        // 如果显然追不上，就可以直接放入
        if (vWaiting <= vLast) {
          return track.top;
        }
        const catchTime =
          (diffDistance - DM_SAFE_DISTANCE) / (vWaiting - vLast);
        // 如果追不上
        if (catchTime >= lastDmRemainLength / vLast) {
          return track.top;
        }
      }
      return null;
    },
    [tracks, props.containerEl]
  );

  const frame = useMemo(() => {
    return () => {
      if (props.videoStatus === VideoStatus.PAUSE) {
        return;
      }
      if (!danmakuList.length || !tracks.length) {
        return;
      }
      const currentTime = props.videoEl?.currentTime || 0;
      if (!currentTime) {
        return;
      }
      const newTracks = [...tracks];
      while (danmakuCurosrRef.current < danmakuList.length) {
        const dm = danmakuList[danmakuCurosrRef.current];
        if (parseFloat(dm.startTime) > currentTime) {
          break;
        }
        const targetTrackTop = findTargetTrack(dm);
        if (targetTrackTop === null) {
          danmakuCurosrRef.current++;
          continue;
        }
        const targetTrack = newTracks.find(
          (track) => track.top === targetTrackTop
        );
        const dmWidth = measureDmWidth(dm.text) || 0;
        targetTrack &&
          targetTrack.bullets.push({
            ...dm,
            physic: {
              width: dmWidth,
              top: targetTrack.top,
            },
          });
        danmakuCurosrRef.current++;
      }
      setTracks(newTracks);
    };
  }, [
    props.videoStatus,
    danmakuList,
    tracks,
    props.videoEl,
    danmakuCurosrRef,
    findTargetTrack,
  ]);

  useAnimationFrame(frame);

  const onAnimationEnd = useCallback((id: string, top: number) => {}, []);

  return (
    <div
      className={cx("danmaku-wrapper", {
        playing: props.videoStatus === VideoStatus.PLAYING,
      })}
      onClick={props.onClick}
    >
      {tracks.map((track) => (
        <DanmakuTrack
          key={track.top}
          {...track}
          onAnimationEnd={onAnimationEnd}
        />
      ))}
    </div>
  );
});
