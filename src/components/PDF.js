import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useOutletContext, useParams } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import toast from "react-hot-toast";

function PDF({ open }) {
  const { socket } = useOutletContext();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [synced, setSynced] = useState(true);
  const { room, roomId } = useParams();

  const inputFile = useRef(null);
  const [file, setFile] = useState(null);
  const [pdfUrls, setPdfUrls] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    if (synced) {
      socket.emit("syncPages", pageNumber);
    }
  }, [socket, pageNumber, synced]);

  useEffect(() => {
    socket.on("syncPages", (pageNumber) => {
      setPageNumber(pageNumber);
    });
  }, [socket]);
  useEffect(() => {
    if (file != null) {
      const storage = getStorage();
      const storageRef = ref(storage, `${roomId}/${file.name}`);

      const snapshot = uploadBytes(storageRef, file);
      toast.promise(snapshot, {
        loading: "Uploading....",
        success: "File Uploaded",
        error: "Check your internet connection",
      });
      setFile(null);
    }
  }, [file]);

  useEffect(() => {
    const storage = getStorage();
    const listRef = ref(storage, `${roomId}`);
    listAll(listRef).then((res) =>
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        getDownloadURL(ref(storage, itemRef.fullPath)).then((downloadURL) => {
          // console.log(downloadURL);
          setPdfUrls((url) => [...url, downloadURL]);
        });
      })
    );
  }, []);

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        id="file"
        onChange={(e) => setFile(e.target.files[0])}
        ref={inputFile}
        style={{ display: "none" }}
      />
      <Typography color={"white"} variant="h5" paddingBottom={"10px"}>
        Add PDF
      </Typography>

      <IconButton
        onClick={() => inputFile.current.click()}
        sx={{ "&:hover": { borderRadius: "10px" } }}
      >
        <Box
          sx={{
            width: `${open ? "52vw" : "72vw"}`,
            border: "2px dashed white",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <AddCircleIcon sx={{ color: "white", fontSize: "50px" }} />
        </Box>
      </IconButton>
      <Typography
        color={"white"}
        variant="h5"
        paddingBottom={"10px"}
        paddingTop={"10px"}
      >
        Select PDF
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          backgroundColor: "#393E46",
          width: `${open ? "52vw" : "72vw"}`,
          padding: "10px",
          borderRadius: "10px",
          "&::-webkit-scrollbar": {
            width: "0",
            height: "0",
          },
          overflowX: "auto",
        }}
      >
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
        <PictureAsPdfIcon
          sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
        />
      </Stack>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"center"}
        marginRight="200px"
        marginTop={"50px"}
      >
        <IconButton
          style={{ marginRight: "15px" }}
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
          sx={{
            height: "40px",
            borderRadius: "5px",
            fontSize: "15px",
            backgroundColor: "#10B9AE",
            "&:hover": { bgcolor: "#3D6974" },
            color: "white",
            ":disabled": {
              backgroundColor: "#10B9AE",
            },
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
          <Button
            onClick={() => setSynced((boolVal) => !boolVal)}
            style={{ marginLeft: "15px" }}
            type="button"
            sx={{
              height: "40px",
              borderRadius: "5px",
              fontSize: "15px",
              backgroundColor: "#10B9AE",
              "&:hover": { bgcolor: "#3D6974" },
              color: "white",
              width: "150px",
              marginBottom: "20px",
            }}
          >
            Sync : {synced ? "On" : "Off"}
          </Button>
          <Document
            onLoadSuccess={onDocumentLoadSuccess}
            file="https://firebasestorage.googleapis.com/v0/b/group-study-app-27681.appspot.com/o/IS.pdf?alt=media"
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <Typography variant="h6" sx={{ color: "White", paddingTop: "20px" }}>
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </Typography>
        </Box>

        <IconButton
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
          sx={{
            height: "40px",
            borderRadius: "5px",
            fontSize: "15px",
            backgroundColor: "#10B9AE",
            "&:hover": { bgcolor: "#3D6974" },
            color: "white",
            ":disabled": {
              backgroundColor: "#10B9AE",
            },
            marginLeft: "15px",
          }}
        >
          <ArrowRightIcon />
        </IconButton>
      </Stack>
    </div>
  );
}

export default PDF;
