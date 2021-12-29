// home.pug에서 socket.io.js를 import 해주어서 밑의 함수로 back-end와 front-end가 연결 가능
const socket = io();

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const welcomeFormInput = welcomeForm.querySelector("input");
  socket.emit("enter_room", { contents: welcomeFormInput.value });
  welcomeFormInput.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

/* 
------------------------------------------------------------------------------
// const socket = new WebSocket("ws://localhost:3000");은 실행시키는 환경에 따라 로컬호스트가 다를 수 있으므로
// 변수(객체)를 활용하여 로컬호스트를 불러옴
const socket = new WebSocket(`ws://${window.location.host}`);
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");

function makeStringMessage(type, contents) {
  const jsonMessage = { type, contents };
  return JSON.stringify(jsonMessage);
}

function handleNickSubmit(event) {
  event.preventDefault();
  const inputNick = nickForm.querySelector("input");
  socket.send(makeStringMessage("nickname", inputNick.value));
  inputNick.value = "";
}

function handleMsgSubmit(event) {
  event.preventDefault();
  const inputMsg = msgForm.querySelector("input");
  socket.send(makeStringMessage("new-message", inputMsg.value));
  const liMsg = document.createElement("li");
  liMsg.innerText = `You: ${inputMsg.value}`;
  msgList.append(liMsg);
  inputMsg.value = "";
}

msgForm.addEventListener("submit", handleMsgSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

//socket의 이벤트는 "open, message, close, error"가 있음. 기본 html form의 이벤트에 submit 등이 있는 것 처럼
socket.addEventListener("open", () => {
  console.log("socket OPEN === connected to Server");
});
socket.addEventListener("close", () => {
  console.log("socket CLOSED === disconnected from Server");
});

//back-end로부터 메시지 받아서 화면에 출력.
socket.addEventListener("message", (message) => {
  const liMsg = document.createElement("li");
  liMsg.innerText = message.data;
  msgList.append(liMsg);
});
------------------------------------------------------------------------------
 */
