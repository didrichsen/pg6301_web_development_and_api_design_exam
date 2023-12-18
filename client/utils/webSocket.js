export function configureWebSocket(messageHandler) {
  const protocol = window.location.protocol === "http:" ? "ws" : "wss";
  const socket = new WebSocket(`${protocol}://` + window.location.host);
  socket.addEventListener("message", messageHandler);
  return socket;
}
