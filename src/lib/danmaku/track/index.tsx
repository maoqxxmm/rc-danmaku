import React from "react";
import { Track, TrackBullet } from "../../../type";
import { DanmakuBullet } from "../bullet";

type Props = Track & {
  onAnimationEnd: (bullet: TrackBullet) => void;
};

export const DanmakuTrack: React.FC<Props> = (props) => {
  return (
    <>
      {props.bullets.map((bullet) => (
        <DanmakuBullet
          key={bullet.id}
          bullet={bullet}
          containerWidth={props.width}
          onAnimationEnd={props.onAnimationEnd}
        />
      ))}
    </>
  );
};
