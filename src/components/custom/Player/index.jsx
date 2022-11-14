import * as React from "react";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import PlayerControls from "../PlayerControls.jsx";
import screenfull from "screenfull";

import Video from "/video.mp4";
import video2 from "/video2.mp4";
import video3 from "/video3.mp4";
import { format } from "../../../utils/formatTime.js";
import useKey from "../../../hooks/useKey.jsx";
import { WindowSharp } from "@mui/icons-material";

const useStyles = makeStyles({
  player_wrapper: {
    width: "100%",
    position: "relative",
    // paddingBottom: "56.25%", /* Player ratio: 100 / (1280 / 720) */
    aspectRatio: "16 / 9",
  },
});

const playList = [
  {
    src: Video,
    title: "Video 1",
  },
  {
    src: video2,
    title: "Video 2",
  },
  {
    src: video3,
    title: "Video 3",
  },
];

const videoPlayerOptions = {
  playing: true,
  muted: true,
  volume: 0.5,
  playbackRate: 1.0,
  isFullScreen: false,
  played: 0,
};

let count = 0;

const Player = ({ bookmarks, setBookmarks, time }) => {
  const videoPlayerRef = React.useRef(null);
  const playerContainerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  const classes = useStyles();
  const [videoList, setVideoList] = React.useState(playList);
  const [currentVideo, setCurrentVideo] = React.useState(0);

  const [playerState, setPlayerState] = React.useState(videoPlayerOptions);
  const { playing, muted, volume } = playerState;

  React.useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.volume = volume;
    }

    if (videoPlayerRef?.current?.ended) {
      if (currentVideo < videoList.length - 1) {
        setCurrentVideo(currentVideo + 1);
      } else {
        setCurrentVideo(0);
      }
    }
  }, [videoPlayerRef?.current?.ended]);

  if (time !== "") videoPlayerRef.current.currentTime = time;

  // play and pause
  const handlePlayPause = (makePlay) => {
    if (makePlay === "play") {
      videoPlayerRef.current.play();
      setPlayerState({ ...playerState, playing: true });
    } else if (makePlay === "pause") {
      handleMouseMove();
      videoPlayerRef.current.pause();
      setPlayerState({ ...playerState, playing: false });
    }
  };

  // rewind
  const handleRewind = () => {
    videoPlayerRef.current.currentTime -= 10;
    handleMouseMove();
  };

  // forward
  const handleForward = () => {
    videoPlayerRef.current.currentTime += 10;
    handleMouseMove();
  };

  // next and prev
  const handleNextPrev = (nextOrPrev) => {
    if (nextOrPrev === "next") {
      if (currentVideo < videoList.length - 1) {
        setCurrentVideo(currentVideo + 1);
      } else {
        setCurrentVideo(0);
      }
    } else {
      if (currentVideo > 0) {
        setCurrentVideo(currentVideo - 1);
      } else {
        setCurrentVideo(videoList.length - 1);
      }
    }
  };

  // mute and unmute
  const handleMuteToggle = () => {
    videoPlayerRef.current.muted = !muted;
    setPlayerState({ ...playerState, muted: !muted });
  };

  // change volume
  const handleVolumeChange = (e, newValue) => {
    videoPlayerRef.current.volume = newValue / 100;
    setPlayerState({
      ...playerState,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
    handleMouseMove();
  };

  const handleVolumeSeekDown = (e, newValue) => {
    videoPlayerRef.current.volume = newValue / 100;
    setPlayerState({
      ...playerState,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
    handleMouseMove();
  };

  // playback rate
  const handlePlaybackRateChange = (rate) => {
    videoPlayerRef.current.playbackRate = rate;
    setPlayerState({ ...playerState, playbackRate: rate });
  };

  // full screen
  const handleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
    setPlayerState({ ...playerState, isFullScreen: !playerState.isFullScreen });
  };

  // progress bar
  const handleProgress = (e) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      controlsRef.current.style.opacity = 0;
      controlsRef.current.style.transition = "opacity 0.5s";
      count = 0;
    }

    if (controlsRef.current.style.visibility === "visible") {
      count++;
    }

    const played =
      videoPlayerRef.current.currentTime / videoPlayerRef.current.duration;

    setPlayerState({ ...playerState, played });
  };

  // seek bar
  const handleSeekChange = (e, newValue) => {
    const seekTime = (newValue / 100) * videoPlayerRef.current.duration;
    videoPlayerRef.current.currentTime = seekTime;
    setPlayerState({ ...playerState, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    videoPlayerRef.current.pause();
    setPlayerState({ ...playerState, playing: false });
  };

  const handleSeekMouseUp = (e, newValue) => {
    videoPlayerRef.current.play();
    setPlayerState({ ...playerState, playing: true });
  };

  // video duration
  const currentTime = videoPlayerRef.current
    ? videoPlayerRef?.current?.currentTime
    : "00:00";
  const duration = videoPlayerRef.current
    ? videoPlayerRef?.current?.duration
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);

  // bookmark
  const handleBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoPlayerRef.current, 0, 0, canvas.width, canvas.height);

    const imageURL = canvas.toDataURL();

    canvas.width = 0;
    canvas.height = 0;

    const bookmark = {
      time: currentTime,
      display: elapsedTime,
      image: imageURL,
    };

    setBookmarks([...bookmarks, bookmark]);
  };

  // mouse event
  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    controlsRef.current.style.opacity = 1;
    controlsRef.current.style.transition = "opacity 0.5s";
    count = 0;
  };

  // double click to full screen
  const handleDoubleClick = () => {
    screenfull.toggle(playerContainerRef.current);
    setPlayerState({ ...playerState, isFullScreen: !playerState.isFullScreen });
  };

  // all events are here
  const events = {
    handlePlayPause,
    handleRewind,
    handleForward,
    handleNextPrev,
    handleMuteToggle,
    handleVolumeChange,
    handleVolumeSeekDown,
    handlePlaybackRateChange,
    handleFullScreen,
    handleSeekChange,
    handleSeekMouseDown,
    handleSeekMouseUp,
    elapsedTime,
    totalDuration,
    handleBookmark,
  };

  // keyboard events are here
  useKey(" " || "space" || 32, () =>
    handlePlayPause(playing ? "pause" : "play")
  );
  useKey("ArrowRight", handleForward);
  useKey("ArrowLeft", handleRewind);
  useKey("ArrowUp", () => handleVolumeChange(null, volume * 100 + 5));
  useKey("ArrowDown", () => handleVolumeChange(null, volume * 100 - 5));
  useKey("m" || "M", handleMuteToggle);
  useKey("f" || "F", handleFullScreen);
  useKey("b" || "B", handleBookmark);
  useKey("n" || "N", () => handleNextPrev("next"));
  useKey("p" || "P", () => handleNextPrev("prev"));
  useKey("1", () => handlePlaybackRateChange(0.5));
  useKey("2", () => handlePlaybackRateChange(1));
  useKey("3", () => handlePlaybackRateChange(1.5));
  useKey("4", () => handlePlaybackRateChange(2));
  useKey("0", () => handleSeekChange(null, 0));

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        ref={playerContainerRef}
        className={classes.player_wrapper}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoPlayerRef}
          playsInline
          autoPlay={playing}
          muted={muted}
          className="video-js"
          src={videoList[currentVideo].src}
          onTimeUpdate={handleProgress}
        />

        <PlayerControls
          videoInfo={videoList[currentVideo]}
          events={events}
          playingState={playerState}
          ref={controlsRef}
        />
      </Box>

      <canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Player;
