import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  downloader: {
    width: "500px",
    maxHeight: "160px",
    position: "fixed",
    right: "10px",
    bottom: "10px",
    overflowY: "auto",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
  },
  cardHeader: {
    color: "#fff",
    backgroundColor: "#1976D2",
    padding: "10px",
  },
});

const Downloader = ({ files = [], remove }) => {
  const classes = useStyles();

  return (
    <Box className={classes.downloader}>
      <Card>
        <Typography variant="h6" component="div" className={classes.cardHeader}>
          Preparing to download
        </Typography>

        <CardContent>
          <ul className="list-group list-group-flush">
            {files.map((file, idx) => {
              return (
                <DownloadItem
                  key={idx}
                  removeFile={() => remove(file.downloadId)}
                  {...file}
                />
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Downloader;

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props?.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const DownloadItem = ({ title, src, removeFile }) => {
  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0,
  });

  useEffect(() => {
    const options = {
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        setDownloadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
        });
      },
    };

    axios
      .get(src, {
        responseType: "blob",
        ...options,
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers["content-type"],
          })
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", title);
        document.body.appendChild(link);
        link.click();

        setDownloadInfo((info) => ({
          ...info,
          completed: true,
        }));

        setTimeout(() => {
          removeFile();
        }, 4000);
      });
  }, []);

  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Typography variant="h6" component="div">
                {title}
              </Typography>

              <Box>
                <small>
                  {downloadInfo.loaded > 0 && (
                    <>
                      <span className="text-success">
                        {formatBytes(downloadInfo.loaded)}
                      </span>
                      / {formatBytes(downloadInfo.total)}
                    </>
                  )}

                  {downloadInfo.loaded === 0 && <>Initializing...</>}
                </small>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                marginLeft: "auto",
              }}
            >
              {downloadInfo.completed && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    float: "right",
                  }}
                >
                  Completed{" "}
                  <CheckCircleIcon
                    sx={{
                      fontSize: 20,
                      color: "green",
                    }}
                  />
                </span>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <LinearProgressWithLabel value={downloadInfo.progress} />
      </Grid>

      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div className="d-inline font-weight-bold text-truncate">{title}</div>
          <div className="d-inline ml-2">
            <small>
              {downloadInfo.loaded > 0 && (
                <>
                  <span className="text-success">
                    {formatBytes(downloadInfo.loaded)}
                  </span>
                  / {formatBytes(downloadInfo.total)}
                </>
              )}

              {downloadInfo.loaded === 0 && <>Initializing...</>}
            </small>
          </div>
        </Box>
      </Box>

      <LinearProgressWithLabel value={downloadInfo.progress} /> */}
    </Grid>
  );
};
