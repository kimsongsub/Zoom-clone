// home.pug에서 socket.io.js를 import 해주어서 밑의 함수로 back-end와 front-end가 연결 가능
const socket = io();

const welcomeForm = document.querySelector("#enter-room-form");
const outRoom = document.getElementById("out-room");
const inRoom = document.getElementById("in-room");
const chatForm = inRoom.querySelector("#chat-form");
const nicNameForm = outRoom.querySelector("#nicname-form");
let roomName;

inRoom.hidden = true;

function hideRoomForm() {
  welcomeForm.hidden = true;
  inRoom.hidden = false;
  const enteredRoomName = outRoom.querySelector("h3");
  enteredRoomName.innerText = `<Room> ${roomName}`;
}

function addMessage(message) {
  const ul = inRoom.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  socket.emit("nicName", "Anonymous");
  const welcomeFormInput = welcomeForm.querySelector("input");
  roomName = welcomeFormInput.value;
  socket.emit("enter_room", roomName, hideRoomForm);
  welcomeFormInput.value = "";
}

function handleChatSubmit(event) {
  event.preventDefault();
  const chatInput = chatForm.querySelector("input");
  const chat = chatInput.value;
  socket.emit("new_chat", chatInput.value, roomName, () => {
    addMessage(`You: ${chat}`);
    // addMessage(`You: ${chatInput.value}`);에서 함수가 서버사이드로 보내지고 바로 밑 줄에서
    // 빈칸으로 초기화 해버리기 때문에 서버에서 이 함수를 호출하면 아무것도 안 뜸
  });
  //굳이 You:~ 부분을 서버에 같이 보냈다가 프론트에서 호출하는 이유는
  //그 앞의 내용이 서버에 잘 전달도 안 됐는데 나한테만 뜨는 것을 방지하기 위해
  chatInput.value = "";
}

function handleNicnameSubmit(event) {
  event.preventDefault();
  const nicNameInput = nicNameForm.querySelector("input");
  const nicName = nicNameInput.value;
  socket.emit("nicName", nicName);
  nicNameInput.value = "";
  const savedNicname = nicNameForm.querySelector("h4");
  savedNicname.innerText = `Current Nicname: [${nicName}]`;
}

nicNameForm.addEventListener("submit", handleNicnameSubmit);
chatForm.addEventListener("submit", handleChatSubmit);
welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcomeMsg", (nicName, countRoomMembers) => {
  const enteredRoomName = outRoom.querySelector("h3");
  enteredRoomName.innerText = `<Room> ${roomName} (${countRoomMembers})`;
  addMessage(`[${nicName}] has Joined the Room`);
});

socket.on("byeMsg", (nicName, countRoomMembers) => {
  const enteredRoomName = outRoom.querySelector("h3");
  enteredRoomName.innerText = `<Room> ${roomName} (${countRoomMembers})`;
  addMessage(`[${nicName}] has left the Room`);
});

socket.on("new_chat", (chat, nicName) => {
  addMessage(`${nicName}: ${chat}`);
});

socket.on("room_change", (findPublicRooms) => {
  const avaliableRoom = welcomeForm.querySelector("h4");
  const avaliableRoomLi = avaliableRoom.querySelector("li");
  avaliableRoomLi.innerText = findPublicRooms;
});
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
