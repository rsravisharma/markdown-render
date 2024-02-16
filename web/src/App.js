import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import socketIOClient from "socket.io-client";
import { Grid } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from '@mui/material/styles';

//theme for main page
const themeDark = createTheme({
  palette: {
    background: {
      default: "#C9C4FF"
    },
    text: {
      primary: "#222222"
    }
  }
});

// markdown text function
function Markdown(props) {
  const { textData } = props;
  //render the markdown file
  return <div style={{ fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: textData }}></div>;
}

//markdown frame function
function MarkdownFrame(props) {
  const { children, ...remainingProps } = props;

  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe {...remainingProps} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

export default function App() {

  const [markdownData, setMarkdownData] = useState("# A demo of `markdown`");
  const [endpoint] = useState("http://127.0.0.1:3001");
  const [markData, setMarkData] = useState();
  const [markdownTextBody, setMarkdownTextBody] = useState(undefined);

  // socket client for sending data to server
  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ['websocket'] });
    socket.on('send-markdown-data', function (data, callback) {
      return callback(markdownData);
    });
    socket.on('get-markdown-data', function (data) {
      setMarkData(data);
    });
    console.log('the data fetched is ', markData);
  }, [markdownData]);

  // markdown body data
  useEffect(() => {
    setMarkdownTextBody(
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          background: "#E4E2FB",
          resize: "both",
          overflow: "auto"
        }}
      >
        <Markdown textData={markData} />
      </div>
    );
  }, [markData]);

  return (
    <ThemeProvider theme={themeDark}>
    <CssBaseline />

      <Grid container>

        <Grid md={6}>
          <div style={{ marginLeft: "20px" }}>
            <h3 style={{textAlign:"center"}}>Edit Markdown here</h3>
            <textarea
              style={{
                border: "1px solid",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "93%",
                height: "100vh",
                background: "#fff",
                resize: "both",
                overflow: "auto"
              }}
              placeholder={markdownData}
              value={markdownData}
              onChange={(e) => setMarkdownData(e.target.value)}
            />
          </div>
        </Grid>

        <Grid md={6}>
          <h3 style={{textAlign:"center"}}>Markdown Screen</h3>
          <MarkdownFrame
            style={{
              border: "1px solid",
              width: "93%",
              height: "100vh",
              background: "#E4E2FB",
              resize: "both",
              overflow: "auto"
            }}
          >
            {markdownTextBody}
          </MarkdownFrame>
        </Grid>

      </Grid>

    </ThemeProvider>
  )

}
