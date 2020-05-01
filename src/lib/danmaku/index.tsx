import React, { memo } from "react";
import { Bullet, VideoStatus } from "../../type";
import "./index.css";

interface Props {
  containerEl: HTMLElement | null;
  videoStatus: VideoStatus;
  danmakuList: Bullet[];
  onClick: () => void;
}

export const Danmaku: React.FC<Props> = memo((props) => {
  return (
    <div className="danmaku-wrapper" onClick={props.onClick}>
      {props.danmakuList.map((dm) => (
        <div key={dm.id} className="bullet-item">
          {dm.text}
        </div>
      ))}
    </div>
  );
});
