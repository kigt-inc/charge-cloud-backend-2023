const socketIo = require("socket.io")
let ioInstance: any;


export const initIO = (httpServer?: any) => {
  if (!ioInstance) {
    ioInstance = socketIo(httpServer);
  }
  return ioInstance;
};
