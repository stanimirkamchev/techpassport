export const ioConfig = {
  url: window.location.origin,
  options: { forceNew: false, transports: ['websocket'], reconnectionDelay: 500, reconnectionDelayMax: 1000, autoConnect: false }
};
