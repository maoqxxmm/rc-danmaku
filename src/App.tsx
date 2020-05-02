import React, { memo, useRef, useState, useCallback } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { VideoStatus } from "./type";
import { Danmaku } from "./lib/danmaku";
import { MockBullets } from "./mock/bullets";

const App: React.FC = memo(() => {
  const [status, setStatus] = useState<VideoStatus>(VideoStatus.PAUSE);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onPlay = useCallback(() => {
    setStatus(VideoStatus.PLAYING);
  }, []);

  const onPause = useCallback(() => {
    setStatus(VideoStatus.PAUSE);
  }, []);

  const onClickDanmaku = useCallback(() => {
    if (videoRef.current) {
      if (status === VideoStatus.PAUSE) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoRef, status]);

  return (
    <div className="app">
      <div className="video-wrap" ref={(el) => setContainerEl(el)}>
        <video
          ref={videoRef}
          className="video"
          // Thanks to DIYgod http://dplayer.js.org/
          src="https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
          // autoPlay={true}
          controls={true}
          onPlay={onPlay}
          onPause={onPause}
        ></video>
        <Danmaku
          containerEl={containerEl}
          videoStatus={status}
          danmakuList={MockBullets}
          onClick={onClickDanmaku}
        />
      </div>
    </div>
  );
});

export default App;
