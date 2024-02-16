const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 3001;

//for markdown file render library
const markdownit = require('markdown-it');
const md = markdownit();

// creating the server
const server = http.createServer();

//socket for connection
const io = socketIo(server);
io.on("connection", socket => {
  getApiAndEmit(socket);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// socket emmit call
const getApiAndEmit = socket => {
  try {
    socket.emit('send-markdown-data', {}, function(dataFromServer) {
        let markdown = md.render(dataFromServer);
        socket.emit('get-markdown-data', markdown);
    });
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));