import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import sequelize from "./utils/db-connection";
import indexRouter from "./routes/index";
import { initIO } from "./utils/socket";
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = initIO(server);

io.on("connection", (socket: any) => {
  console.log(`User connected ${socket?.id}`);
  socket.on("disconnect", function () {
    console.log("User disconnected");
  });
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// connect and sync all the db tables with models on initial start.
sequelize.sync();
sequelize.authenticate();

app.use("/", indexRouter);

server.listen(port, () => {
  console.log(`Server started on Port: ${port}`);
});
