import * as React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// City
// import "@videojs/themes/dist/city/index.css";

// Fantasy
// import "@videojs/themes/dist/fantasy/index.css";

// Forest
// import "@videojs/themes/dist/forest/index.css";

// Sea
// import "@videojs/themes/dist/sea/index.css";

const Player = ({ options, src, themeName = "sea" }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, options, () => {
        console.log("onPlayerReady", this);
      });
    }

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, videoRef, playerRef]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered vjs-theme-${themeName}`}
      />
    </div>
  );
};

export default Player;
