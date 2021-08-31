import { EventEmitter } from "events";

export default class Socket {
    ws: WebSocket
    ee: EventEmitter
  constructor(ws: WebSocket, ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
    ws.onerror = this.error.bind(this);
  }

  on(name: string, fn: () => void) {
    this.ee.on(name, fn);
  }
  
  onMessage(name: string, fn: (mev: MessageEvent)=>void){
    this.ee.on(name, fn);
  }

  off(name: string, fn: () => void) {
    this.ee.removeListener(name, fn);
  }

  open() {
    this.ee.emit("connect");
  }

  close() {
    this.ee.emit("disconnect");
  }

  error(e: Event) {
    console.log("websocket error: ", e);
  }

  emit(data: string) {// 今送りたいのがstring -> jsonを返すならここがObject
    this.ws.send(data)
  }

  message(e: MessageEvent) {
    try {
      this.ee.emit("message", e);

    } catch (err) {
      this.ee.emit("error", err);
      console.log(Date().toString() + ": ", err);
    }
  }
}
