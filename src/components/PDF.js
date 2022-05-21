import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Button, IconButton, Dialog, Stack, Typography, DialogContent, CircularProgress } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useOutletContext, useParams } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import Tooltip from '@mui/material/Tooltip';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ReplayIcon from '@mui/icons-material/Replay';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import toast from "react-hot-toast";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

function PDF({ open }) {
  const { socket } = useOutletContext();
  const { room, roomId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [synced, setSynced] = useState(false);
  const [refetchFiles, setRefetchFiles] = useState(true);
  const [url, setUrl] = useState("");
  const [fetchingPDFS, setFetchingPDFS] = useState(false);

  const handleModalClose = () => { setShowModal(false); setUrl("") };

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
    if(url) {
      setShowModal(true);
    }
  }, [url])
  

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
    if(refetchFiles) {
      setFetchingPDFS(true);
      setPdfUrls([]);
      const storage = getStorage();
      const listRef = ref(storage, `${roomId}`);
      listAll(listRef).then((res) =>{
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          getDownloadURL(ref(storage, itemRef.fullPath)).then((downloadURL) => {
            setPdfUrls((url) => [...url, { name: itemRef.name, downloadURL }]);
          });
        })
        setFetchingPDFS(false);
      });
      setRefetchFiles(false);
    }
  }, [refetchFiles]);

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
        sx={{ "&:hover": { borderRadius: "10px" }, marginBottom: "20px" }}
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          color={"white"}
          variant="h5"
          paddingBottom={"10px"}
          paddingTop={"10px"}
        >
          Select PDF
        </Typography>
        <IconButton onClick={() => setRefetchFiles(true)} sx={{ backgroundColor: "transparent", border: "none", color: "white", marginTop: "5px", marginLeft: `${open ? "43vw" : "63vw"}` }}>
          <ReplayIcon />
        </IconButton>
      </div>
      <Stack
        direction={"row"}
        sx={{
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
        {fetchingPDFS && <CircularProgress sx={{ alignSelf: "center" }} />}
        {pdfUrls.map((url, index) => 
          <Button onClick={() => setUrl(url.downloadURL)} sx={{ display: "flex", flexDirection : "column", backgroundColor: "#393E46", width: "175px",  marginRight: "20px" }} key={index}>
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize:  "150px" }}
            />
            <Typography noWrap sx={{ color: "white", width: "100%", marginTop: "7px" }}>{url.name}</Typography>
          </Button>
        )}
      </Stack>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"center"}
        marginRight="200px"
        marginTop={"50px"}
      >
        <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
          <Dialog
            sx={{ "& .MuiDialog-paper": {
              color: "white",
              backgroundColor: "transparent",
              boxShadow: "none"
            }, "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }, "& .MuiDialogContent-root" : {
                overflow: "hidden"
              }}}
            open={showModal}
            onClose={handleModalClose}
            scroll="body"
          >
            <DialogContent sx={{ padding: 0, borderTop: 0, borderBottom: 0 }}>
                <Document
                  onLoadSuccess={onDocumentLoadSuccess}
                  file={url}
                  >
                <Page loading={() => <div style={{ color: "white" }}>Loading PDF...</div>} pageNumber={pageNumber} />
                </Document>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "fixed", bottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" sx={{ color: "white", backgroundColor: "black", padding: "2px 15px", borderRadius: "5px" }}>
                  Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </Typography>
              </div>
              <Tooltip title={synced ? "Toggle syncing off" : "Toggle syncing on"} arrow>
                <Button
                  onClick={() => setSynced((boolVal) => !boolVal)}
                  type="button"
                  sx={{
                    position: "fixed",
                    bottom: "20px",
                    right: "40px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    fontSize: "15px",
                    backgroundColor: "#10B9AE",
                    "&:hover": { bgcolor: "#3D6974" },
                    color: synced ? "white" : "grey",
                    minWidth: "auto"
                  }}
                >
                  <SyncIcon />
                </Button>
              </Tooltip>
              <IconButton
                style={{ marginRight: "15px" }}
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "40px",
                  height: "40px",
                  borderRadius: "50%",
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
              <IconButton
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                sx={{
                  position: "fixed",
                  top: "50%",
                  right: "40px",
                  height: "40px",
                  borderRadius: "50%",
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
            </DialogActions>
          </Dialog>
        </Box>
      </Stack>
    </div>
  );
}

export default PDF;
