import * as React from "react";
import Downloader from "../components/Downloader/Downloader";
import { uniqueId } from "../utils/uniqeId";

const useFileDownloader = () => {
  const [files, setFiles] = React.useState([]);
  console.log(
    "🚀 ~ file: useFileDownloader.jsx ~ line 7 ~ useFileDownloader ~ files",
    files
  );

  const download = (file) => {
    const downloadId = uniqueId();
    const newFile = {
      ...file,
      downloadId,
    };

    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const remove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.downloadId !== id));
  };

  return [
    (file) => download(file),
    files.length > 0 ? (
      <Downloader files={files} remove={(e) => remove(e)} />
    ) : null,
  ];
};

export default useFileDownloader;
