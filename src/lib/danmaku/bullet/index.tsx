import React, { memo } from "react";
import { TrackBullet } from "../../../type";
import "./index.css";
import { DM_ANIMATE_DURATION } from "..";

interface Props {
  bullet: TrackBullet;
  containerWidth: number;
  onAnimationEnd: (id: string, top: number) => void;
}

export const DanmakuBullet: React.FC<Props> = memo((props) => {
  return (
    <div
      className="danmaku-bullet-item"
      data-bullet-id={props.bullet.id}
      style={{
        top: props.bullet.physic.top,
        transform: `translateX(-${props.containerWidth}px)`,
        color: props.bullet.color ? `#${props.bullet.color.slice(2)}` : "",
        animationDuration: `${DM_ANIMATE_DURATION}s`,
      }}
      onAnimationEnd={() => {
        props.onAnimationEnd(props.bullet.id, props.bullet.physic.top);
      }}
    >
      {props.bullet.text}
    </div>
  );
});
