import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Popover from "@mui/material/Popover";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import IconButton from "@mui/material/IconButton";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DownloadIcon from "@mui/icons-material/Download";

// styles
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";

const useStyles = makeStyles({
  player_control_wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },

  controlIcon: {
    color: "#fff",
    fontSize: 50,
    transform: "scaleX(0.9)",
    transition: "all 0.2s ease-in-out",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.3)",
      transform: "scale(1)",
    },
  },

  bottomIcon: {
    color: "#999",
    fontSize: 20,

    "&:hover": {
      color: "#fff",
    },
  },
});

const PlayerControls = React.forwardRef(
  ({ events, playingState, videoInfo }, ref) => {
    const { playing, muted, volume, playbackRate, isFullScreen, played } =
      playingState;
    const {
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
      handleDownload,
    } = events;

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "playbackRate-popover" : undefined;

    return (
      <Box className={classes.player_control_wrapper} ref={ref}>
        {/* top control */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: "16px",
          }}
        >
          <Grid item>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
              }}
            >
              {videoInfo.title}
            </Typography>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookmarksIcon />}
              onClick={handleBookmark}
            >
              Bookmark
            </Button>
          </Grid>
        </Grid>

        {/* middle controls */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            aria-label="rewind"
            className={classes.controlIcon}
            onClick={handleRewind}
          >
            <FastRewindIcon
              sx={{
                color: "#fff",
                fontSize: 30,
              }}
            />
          </IconButton>

          {playing ? (
            <IconButton
              aria-label="pause"
              onClick={() => handlePlayPause("pause")}
            >
              <PauseIcon
                sx={{
                  color: "#fff",
                  fontSize: 30,
                }}
              />
            </IconButton>
          ) : (
            <IconButton
              aria-label="play"
              onClick={() => handlePlayPause("play")}
            >
              <PlayArrowIcon
                sx={{
                  color: "#fff",
                  fontSize: 30,
                }}
              />
            </IconButton>
          )}

          <IconButton
            aria-label="forward"
            className={classes.controlIcon}
            onClick={handleForward}
          >
            <FastForwardIcon
              sx={{
                color: "#fff",
                fontSize: 30,
              }}
            />
          </IconButton>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: "16px",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                marginRight: "16px",
              }}
              variant="body2"
            >
              {elapsedTime}
            </Typography>

            <PlayerSlider
              aria-label="time-indicator"
              size="small"
              min={0}
              step={1}
              max={100}
              value={played * 100}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onChangeCommitted={handleSeekMouseUp}
            />

            <Typography
              sx={{
                color: "#fff",
                marginLeft: "16px",
              }}
              variant="body2"
            >
              {totalDuration}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* left side */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="prev"
                  onClick={() => handleNextPrev("prev")}
                >
                  <SkipPreviousIcon className={classes.bottomIcon} />
                </IconButton>

                {playing ? (
                  <IconButton
                    aria-label="pause"
                    onClick={() => handlePlayPause("pause")}
                  >
                    <PauseIcon className={classes.bottomIcon} />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="play"
                    onClick={() => handlePlayPause("play")}
                  >
                    <PlayArrowIcon className={classes.bottomIcon} />
                  </IconButton>
                )}

                <IconButton
                  aria-label="next"
                  onClick={() => handleNextPrev("next")}
                >
                  <SkipNextIcon className={classes.bottomIcon} />
                </IconButton>

                {muted ? (
                  <IconButton aria-label="mute" onClick={handleMuteToggle}>
                    <VolumeOffIcon className={classes.bottomIcon} />
                  </IconButton>
                ) : (
                  <IconButton aria-label="unmute" onClick={handleMuteToggle}>
                    <VolumeUpRounded className={classes.bottomIcon} />
                  </IconButton>
                )}

                <VolumeSlider
                  min={0}
                  max={100}
                  aria-label="Volume"
                  value={muted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  onChangeCommitted={handleVolumeSeekDown}
                />
              </Box>

              {/*right side  */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="download"
                  onClick={() => handleDownload(videoInfo)}
                >
                  <DownloadIcon className={classes.bottomIcon} />
                </IconButton>

                <Button
                  variant="text"
                  sx={{
                    color: "#999",

                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                  aria-describedby={id}
                  onClick={handlePopover}
                >
                  {playbackRate}X
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {[0.5, 0.75, 1, 1.5, 2].map((rate) => (
                    <Box key={rate}>
                      <Button
                        variant="text"
                        sx={{
                          padding: "5px 10px",
                          color: playbackRate === rate ? "#999" : "#000",
                        }}
                        onClick={() => handlePlaybackRateChange(rate)}
                      >
                        {rate}X
                      </Button>
                    </Box>
                  ))}
                </Popover>

                {isFullScreen ? (
                  <IconButton
                    aria-label="fullscreen"
                    onClick={handleFullScreen}
                  >
                    <FullscreenExitIcon className={classes.bottomIcon} />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="fullscreen"
                    onClick={handleFullScreen}
                  >
                    <FullscreenIcon className={classes.bottomIcon} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default PlayerControls;

const VolumeSlider = styled(Slider)({
  width: 100,
  marginLeft: 10,
  color: "#fff",

  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    width: 20,
    height: 20,
    backgroundColor: "#999",

    "&:hover": {
      backgroundColor: "#fff",
    },
    "&:before": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible, &.Mui-active": {
      boxShadow: "none",
    },
  },
});

const PlayerSlider = styled(Slider)({
  height: 4,
  color: "#fff",
  "& .MuiSlider-thumb": {
    width: 15,
    height: 15,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&:before": {
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px rgb(255 255 255 / 16%)`,
    },
    "&.Mui-active": {
      width: 20,
      height: 20,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.28,
  },
});
