// const socket = new WebSocket("ws://localhost:3000");은 실행시키는 환경에 따라 로컬호스트가 다를 수 있으므로
// 변수(객체)를 활용하여 로컬호스트를 불러옴
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("socket OPEN === connected to Server");
});

//front-end(server)에서 back-end로부터 메시지 받는 방법.
socket.addEventListener("message", (message) => {
  console.log(`We got message: [${message.data}] from the server`);
});

//front-end가 back-end(server)에게 메시지 보내는 방법.
setTimeout(() => {
  socket.send("Browser is here 🙌");
}, 5000);

//socket의 이벤트는 "open, message, close, error"가 있음. 기본 html form의 이벤트에 submit 등이 있는 것 처럼
socket.addEventListener("close", () => {
  console.log("socket CLOSE === disconnected from Server");
});
