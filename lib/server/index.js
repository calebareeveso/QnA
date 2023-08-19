const dev = process.env.NODE_ENV !== "production";
const server = dev
  ? "http://localhost:5173"
  : "https://your_deployment.server.com";

export default server;
