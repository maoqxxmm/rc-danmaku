import {
  Bullet,
  BulletType,
  RightTrack,
  TopTrack,
  BottomTrack,
} from "../../type";
import { DM_SAFE_DISTANCE, DM_ANIMATE_DURATION, Tracks } from ".";

export const measureDmWidth = (text: string) => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) {
    console.log(`init canvas failed: ${text}`);
    return 0;
  }
  ctx!.font = getComputedStyle(document.body).getPropertyValue("font");
  return ctx!.measureText(text).width;
};

export const findTargetTrack = (
  dm: Bullet,
  tracks: Tracks,
  containerEl: HTMLElement
) => {
  switch (dm.type) {
    case BulletType.TOP:
      return isBulletInTopTrack(dm, tracks[BulletType.TOP], containerEl);
    case BulletType.BOTTOM:
      return isBulletInBottomTrack(dm, tracks[BulletType.BOTTOM], containerEl);
    case BulletType.RIGHT:
    default:
      return isBulletInRightTrack(dm, tracks[BulletType.RIGHT], containerEl);
  }
};

const isBulletInRightTrack = (
  dm: Bullet,
  tracks: RightTrack[],
  containerEl: HTMLElement
) => {
  for (let track of tracks) {
    const lastDm = track.bullets[track.bullets.length - 1];
    if (!lastDm) {
      return track;
    }
    const $lastDm = document.querySelector(`[data-bullet-id="${lastDm.id}"]`);
    // 不存在就说明已经被其他候选弹幕占用了
    if (!$lastDm) {
      continue;
    }
    const $lastDmRect = $lastDm.getBoundingClientRect();
    const $containerRect = containerEl.getBoundingClientRect();
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
      return track;
    }
    const waitingDmWidth = measureDmWidth(dm.text) || 0;
    const vLast =
      ($containerRect.width + $lastDmRect.width) / DM_ANIMATE_DURATION;
    const vWaiting =
      ($containerRect.width + waitingDmWidth) / DM_ANIMATE_DURATION;
    // 如果显然追不上，就可以直接放入
    if (vWaiting <= vLast) {
      return track;
    }
    const catchTime = (diffDistance - DM_SAFE_DISTANCE) / (vWaiting - vLast);
    // 如果追不上
    if (catchTime >= lastDmRemainLength / vLast) {
      return track;
    }
  }
  return null;
};
const isBulletInTopTrack = (
  dm: Bullet,
  tracks: TopTrack[],
  containerEl: HTMLElement
) => {
  for (let track of tracks) {
    if (!track.bullets.length) {
      return track;
    }
  }
  return null;
};

const isBulletInBottomTrack = (
  dm: Bullet,
  tracks: BottomTrack[],
  containerEl: HTMLElement
) => {
  for (let track of tracks) {
    if (!track.bullets.length) {
      return track;
    }
  }
  return null;
};
