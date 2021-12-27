const socket = new WebSocket(`ws://${window.location.host}`);
// const socket = new WebSocket("ws://localhost:3000");은 실행시키는 환경에 따라 로컬호스트가 다를 수 있으므로
// 변수(객체)를 활용하여 로컬호스트를 불러옴
