import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Button, IconButton, Dialog, Stack, Typography, DialogContent } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useOutletContext } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

function PDF({ open }) {
  const { socket } = useOutletContext();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(true);
  const [synced, setSynced] = useState(false);
  const [url, setUrl] = useState("");

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

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

  return (
    <div>
      <Typography color={"white"} variant="h5" paddingBottom={"10px"}>
        Add PDF
      </Typography>

      <IconButton sx={{ "&:hover": { borderRadius: "10px" } }}>
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
        <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
          <Dialog
            sx={{ "& .MuiDialog-paper": {
              backgroundColor: "transparent",
              boxShadow: "none"
            }, "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.7)"
            }}}
            open={showModal}
            onClose={handleModalClose}
            scroll="body"
          >
            <DialogContent sx={{ padding: 0, borderTop: 0, borderBottom: 0 }}>
                <Document
                  onLoadSuccess={onDocumentLoadSuccess}
                  file="https://firebasestorage.googleapis.com/v0/b/group-study-app-27681.appspot.com/o/IS.pdf?alt=media"
                  >
                <Page canvasBackground="transparent" pageNumber={pageNumber} />
                </Document>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "fixed", bottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" sx={{ color: "white", backgroundColor: "black", padding: "2px 15px", borderRadius: "5px" }}>
                  Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </Typography>
              </div>
              <Tooltip title="Toggle syncing" arrow>
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
