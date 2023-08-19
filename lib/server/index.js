const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:5173" : "https://calebqna.vercel.app";

export default server;
