import React, { memo } from "react";
import cx from "classnames";
import { TrackBullet, BulletType } from "../../../type";
import "./index.css";
import { DM_ANIMATE_DURATION } from "..";

interface Props {
  bullet: TrackBullet;
  containerWidth: number;
  onAnimationEnd: (bullet: TrackBullet) => void;
}

export const DanmakuBullet: React.FC<Props> = memo((props) => {
  const { bullet } = props;

  const cls = cx("danmaku-bullet-item", {
    "danmaku-bullet-right": bullet.type === BulletType.RIGHT,
    "danmaku-bullet-top": bullet.type === BulletType.TOP,
    "danmaku-bullet-bottom": bullet.type === BulletType.BOTTOM,
  });

  const getStyle = () => {
    const baseStyle = {
      color: bullet.color ? `#${bullet.color.slice(2)}` : "",
      animationDuration: `${DM_ANIMATE_DURATION}s`,
    };
    if (bullet.type === BulletType.RIGHT) {
      return {
        ...baseStyle,
        top: bullet.physic.top,
        transform: `translateX(-${props.containerWidth}px)`,
      };
    } else if (bullet.type === BulletType.TOP) {
      return {
        ...baseStyle,
        top: bullet.physic.top,
      };
    } else if (bullet.type === BulletType.BOTTOM) {
      return {
        ...baseStyle,
        bottom: bullet.physic.bottom,
      };
    }
  };

  return (
    <div
      className={cls}
      data-bullet-id={bullet.id}
      style={getStyle()}
      onAnimationEnd={() => {
        props.onAnimationEnd(bullet);
      }}
    >
      {bullet.text}
    </div>
  );
});
