import { EventEmitter } from "events";

export default class Socket {
  constructor(ws, ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
    ws.onerror = this.error.bind(this);
  }

  on(name, fn) {
    this.ee.on(name, fn);
    // console.log("on")
  }

  off(name, fn) {
    this.ee.removeListener(name, fn);
    console.log("of")
  }

  open() {
    this.ee.emit("connect");
    console.log("connect")
  }

  close() {
    this.ee.emit("disconnect");
    console.log("disconnect")
  }

  error(e) {
    console.log("websocket error: ", e);
  }

  emit(data) {
    this.ws.send(data)
    console.log("emit")
  }

  message(e) {
    try {
      this.ee.emit("message", e);
      console.log("message next is E")
      console.log(e)
    } catch (err) {
      this.ee.emit("error", err);
      console.log(Date().toString() + ": ", err);
    }
  }
}
