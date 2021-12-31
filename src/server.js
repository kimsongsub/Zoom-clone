import http from "http";
import express from "express";
// import WebSocket from "ws";
import { Server } from "socket.io";

// express가 하는 일은 (1)views를 설정해주고 (2)render해주고 (3)Listen해주는 것이 전부
// 나머지 기능은 websocket에서 실시간으로 관리
const app = express();
//(1)
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
//(2)
app.get("/", (req, res) => res.render("home.pug"));
//(2-1) 만드려는 페이지는 싱글페이지여서 static으로 허용된 주소(public)이외에 다른 명령어(주소)를 입력하면 home위치로 redirect 시킴
app.get("/*", (req, res) => res.redirect("/"));
//(3)
const handleListen = () =>
  console.log("server opened !!\n[Listening on http://localhost:3000]");
// app.listen(3000);
// --------------------------------------------------------------------------------------------------------------
// 두 종류의 프로토콜을 한번에 적용 (두개가 같은 포트에)
// make http server
const httpServer = http.createServer(app);
//make socketServer from socket.io
const socketIOServer = new Server(httpServer);

socketIOServer.on("connection", (socket) => {
  socket.on("enter_room", (RoomName, hideRoomForm) => {
    socket.join(RoomName);
    hideRoomForm();
    socket
      .to(RoomName)
      .emit("welcomeMsg", socket.nicName, countRoomMembers(RoomName));
    socketIOServer.sockets.emit("room_change", findPublicRooms());
  });

  socket.on("nicName", (nicName) => (socket["nicName"] = nicName));

  socket.on("new_chat", (chat, roomName, selfChat) => {
    socket.to(roomName).emit("new_chat", chat, socket.nicName);
    selfChat();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      //여기서 disconnecting은 접속이 끊어지는 것이기 때문에 현재 모든 채팅방에서 모두 나가지는 것
      socket
        .to(room)
        .emit("byeMsg", socket.nicName, countRoomMembers(room) - 1);
    });
  });

  socket.on("disconnect", () => {
    socketIOServer.sockets.emit("room_change", findPublicRooms());
  });
});

httpServer.listen(3000, handleListen);

function findPublicRooms() {
  const sids = socketIOServer.sockets.adapter.sids;
  const rooms = socketIOServer.sockets.adapter.rooms;
  const publicRooms = [];

  // forEach문을 통해 value가 아닌 key(index)를 탐색
  rooms.forEach(function (_, key) {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoomMembers(roomName) {
  const numberOfRoomMembers =
    socketIOServer.sockets.adapter.rooms.get(roomName)?.size;

  return numberOfRoomMembers;
}
/*
//------------------------------------------------------------------------------------------------
// make Web Socket server on http server
const wss = new WebSocket.Server({ server });
// 연결되는 socket들을 여기에 저장하고 저장된 모드 클라이언트(socket)에게 메시지 전송
const socketList = [];

function makeJSONMessage(stringTypeJSON) {
  return JSON.parse(stringTypeJSON);
}

wss.on("connection", (socket) => {
  console.log(
    "Connection complete with Browser 🌹\n ---------------------------"
  );
  socketList.push(socket);
  socket["nickname"] = "Anonyous";
  //front-end에서 back-end(server)로 메시지를 받아서 연결되어 있는 브라우저들에게 메시지 전달.
  socket.on("message", (message) => {
    const jsonMessage = makeJSONMessage(message);
    //현재 연결된(통신중인) socket(브라우저)의 nickname에 내용을 저장하고 forEach로 다른 연결돼있는 브라우저에게 메시지를 전송
    switch (jsonMessage.type) {
      case "nickname":
        socket["nickname"] = jsonMessage.contents;
        break;
      case "new-message":
        socketList.forEach(function (eachSocket) {
          if (socket === eachSocket) {
          } else {
            eachSocket.send(
              `${socket["nickname"]}: ${jsonMessage.contents.toString()}`
            );
          }
        });
        break;
    }
  });
  //socket 연결이 끊어졌을때.
  socket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
});
//----------------------------------------------------------------------------------------
*/
