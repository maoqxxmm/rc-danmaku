import React from "react";
import { Track } from "../../../type";
import { DanmakuBullet } from "../bullet";

type Props = Track;

export const DanmakuTrack: React.FC<Props> = (props) => {
  return (
    <>
      {props.bullets.map((bullet) => (
        <DanmakuBullet
          key={bullet.id}
          bullet={bullet}
          containerWidth={props.width}
        />
      ))}
    </>
  );
};
