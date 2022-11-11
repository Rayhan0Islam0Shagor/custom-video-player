import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Player from "./components/custom/Player";

import "./App.css";

function App() {
  const [bookmarks, setBookmarks] = React.useState([]);
  const [time, setTime] = React.useState("");

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
        <Player bookmarks={bookmarks} setBookmarks={setBookmarks} time={time} />

        <Grid
          container
          sx={{
            marginTop: "1rem",
            padding: "1rem",
          }}
          spacing={2}
        >
          {bookmarks?.map(({ image, display, time }, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                sx={{
                  backgroundColor: "#a0a0a0",
                  cursor: "pointer",
                }}
                onClick={() => setTime(time)}
              >
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
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default App;
