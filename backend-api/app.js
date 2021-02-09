const express = require("express");
const app = express();
const sanitizeHTML = require("sanitize-html");
const jwt = require("jsonwebtoken");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./router"));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingTimeout: 30000
});

io.on("connection", function (socket) {
  socket.on("chatFromClient", function (data) {
    try {
      let user = jwt.verify(data.token, process.env.JWTSECRET);
      socket.broadcast.emit("chatFromServer", { text: sanitizeHTML(data.text, { allowedTags: [], allowedAttributes: {} }), username: user.username, avatar: user.avatar });
    } catch (e) {
      console.log("Not a valid token for chat.");
    }
  });
});

module.exports = server;
