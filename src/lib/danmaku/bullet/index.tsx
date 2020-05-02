import React, { useState, useCallback, useEffect } from "react";
import { TrackBullet } from "../../../type";
import "./index.css";

interface Props {
  bullet: TrackBullet;
  containerWidth: number;
}

export const DanmakuBullet: React.FC<Props> = (props) => {
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    let inited = true;
    setTimeout(() => {
      inited && setAnimate(true);
    }, 100);
    return () => {
      inited = false;
    };
  }, []);

  return (
    <div
      className="danmaku-bullet-item"
      style={{
        top: props.bullet.physic.top,
        transform: animate
          ? `translateX(-${props.containerWidth}px)`
          : undefined,
      }}
    >
      {props.bullet.text}
    </div>
  );
};
