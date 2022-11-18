import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Player from "./components/custom/Player";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import "./App.css";
import useFileDownloader from "./hooks/useFileDownloader";

function App() {
  const [bookmarks, setBookmarks] = React.useState([]);
  const [time, setTime] = React.useState("");
  const [downloadFile, downloaderComponentUI] = useFileDownloader();

  const handleDownload = (file) => downloadFile(file);

  React.useLayoutEffect(() => {
    const loader = document.getElementById("lds-facebook");
    loader.classList.add("loaded");

    setTimeout(() => {
      document.body.removeChild(loader);
    }, 300);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTime("");
    }, 500);

    return () => clearTimeout(timer);
  }, [time]);

  // const videoPLayerOptions = {
  //   controls: true,
  //   sources: [
  //     {
  //       src: Video,
  //       type: "video/mp4",
  //     },
  //   ],
  // };
  // <div className="App">
  //   <Player options={videoPLayerOptions} />
  // </div>

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            Custom Video Player
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Player
          bookmarks={bookmarks}
          handleDownload={handleDownload}
          setBookmarks={setBookmarks}
          time={time}
        />

        <Grid
          container
          sx={{
            marginTop: "1rem",
            padding: "1rem",
          }}
          spacing={2}
        >
          {bookmarks?.map(({ image, display, time }, index) => {
            const downloadInfo = {
              src: image,
              title: display,
            };

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Paper
                  sx={{
                    position: "relative",
                    backgroundColor: "#a0a0a0",
                    cursor: "pointer",
                  }}
                  onClick={() => setTime(time)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    <IconButton onClick={() => handleDownload(downloadInfo)}>
                      <DownloadIcon
                        sx={{
                          color: "#999",

                          "&:hover": {
                            color: "#fff",
                          },
                        }}
                      />
                    </IconButton>
                  </Box>

                  <img
                    src={image}
                    alt="bookmark"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />

                  <Typography variant="h6" component="h3" align="center">
                    Bookmark at {display}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {downloaderComponentUI}
    </>
  );
}

export default App;
