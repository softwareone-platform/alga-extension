export const runHost = (hostWindow: Window, iframeWindow: Window) => {
  console.log("attached");
  hostWindow.onmessage = (event) => {
    console.log("message received in host", event);
  };
};
