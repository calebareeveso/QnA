const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:5173" : "https://qna.caleb.works";

export default server;
