import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function PDF({ socket }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [synced, setSynced] = useState(true);

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Document
        onLoadSuccess={onDocumentLoadSuccess}
        file="https://firebasestorage.googleapis.com/v0/b/group-study-app-27681.appspot.com/o/IS.pdf?alt=media"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <div style={{ display: "flex" }}>
          <button
            style={{ marginRight: "15px" }}
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>
          <button
            onClick={() => setSynced((boolVal) => !boolVal)}
            style={{ marginLeft: "15px" }}
            type="button"
            disabled={pageNumber >= numPages}
          >
            Sync : {synced ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PDF;
